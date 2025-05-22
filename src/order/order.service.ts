import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto, PaginationDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PostFinanceCheckout } from 'postfinancecheckout';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './entities/order.entity';
import { Model, Types } from 'mongoose';
import { Cart, CartDocumnet } from 'src/carts/entities/cart.entity';
import { generateUniqueIdOrder, generateUniqueIdSlug } from 'src/utils/uniqueCode.utils';
import { StatusEnum } from 'src/constant/status';
import { User, UserDocument } from 'src/user/entities/user.entity';
import { AddressCreate } from 'postfinancecheckout/build/src/models/AddressCreate';

@Injectable()
export class OrderService {
  private transactionService: PostFinanceCheckout.api.TransactionService;
  private config;
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Cart.name) private cartModel: Model<CartDocumnet>,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {
    let spaceId: number = configService.get<number>("postfinance.spaceId");
    let userId: number = configService.get<number>("postfinance.userId");
    let apiSecret: string = configService.get<string>("postfinance.apiSecret");
    const auth = Buffer.from(`${userId}:${apiSecret}`).toString("base64");

    this.config = {
      space_id: spaceId,
      user_id: userId,
      api_secret: apiSecret,
      default_headers: {
        Authorization: `Basic ${auth}`,
      },
    }

    this.transactionService = new PostFinanceCheckout.api.TransactionService(this.config);
  }
  async create(request: Request, createOrderDto: CreateOrderDto) {
    try {
      const user = request?.["user"];
      const {
        cartIds,
        billingAddress,
        discountablePrice,
        isShipping,
        payablePrice,
        promoCode,
        shippingAddress,
        totalPrice,
        shippingCharge,
      } = createOrderDto;

      let userData = !user && await this.userModel.findOne({ mobileNumber: shippingAddress.mobileNumber });

      if (userData && userData.isBlocked) {

        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          message: "We're currently unable to process your order. Please contact support if you believe this is a mistake.",
          data: {}
        }, HttpStatus.BAD_REQUEST)

      } else if (!user && !userData) {

        userData = await this.userModel.create({
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          address: shippingAddress,
          mobileNumber: shippingAddress.mobileNumber,
          phoneCode: shippingAddress.phoneCode,
          email: shippingAddress.email
        })

      }

      const transactionPaymentPageService =
        new PostFinanceCheckout.api.TransactionPaymentPageService(this.config);

      const cartItems = await this.cartModel.find({
        _id: { $in: cartIds.map((id) => new Types.ObjectId(id)) },
        isOrder: false,
        status: StatusEnum.Active,
      });

      const lineItems: PostFinanceCheckout.model.LineItemCreate[] = [];

      for (const cartItem of cartItems) {
        const lineItem = new PostFinanceCheckout.model.LineItemCreate();
        lineItem.name = cartItem["title"];
        lineItem.uniqueId = `${cartItem["productId"]}-${generateUniqueIdSlug()}`;
        lineItem.quantity = cartItem["quantity"];
        lineItem.amountIncludingTax = cartItem["salePrice"];
        lineItem.type = PostFinanceCheckout.model.LineItemType.PRODUCT;
        lineItems.push(lineItem);
      }

      if (isShipping && shippingCharge > 0) {
        const shippingItem = new PostFinanceCheckout.model.LineItemCreate();
        shippingItem.name = "Shipping Charges";
        shippingItem.uniqueId = "shipping-charges";
        shippingItem.quantity = 1;
        shippingItem.amountIncludingTax = shippingCharge;
        shippingItem.type = PostFinanceCheckout.model.LineItemType.SHIPPING;
        lineItems.push(shippingItem);
      }

      if (discountablePrice > 0) {
        const discountItem = new PostFinanceCheckout.model.LineItemCreate();
        discountItem.name = "Discount";
        discountItem.uniqueId = promoCode || "discount";
        discountItem.quantity = 1;
        discountItem.amountIncludingTax = -Math.abs(discountablePrice);
        discountItem.type = PostFinanceCheckout.model.LineItemType.DISCOUNT;
        lineItems.push(discountItem);
      }


      const transaction = new PostFinanceCheckout.model.TransactionCreate();
      transaction.lineItems = lineItems;
      transaction.autoConfirmationEnabled = true;
      transaction.currency = "CHF";

      transaction.billingAddress = {
        city: billingAddress.city,
        country: billingAddress.country,
        emailAddress: billingAddress.email,
        familyName: billingAddress.lastName,
        givenName: billingAddress.firstName,
        mobilePhoneNumber: billingAddress.mobileNumber,
        phoneNumber: billingAddress.mobileNumber,
        postalState: billingAddress.state,
        postcode: billingAddress.zipCode,
        street: billingAddress.address1 + " " + billingAddress.address2
      };

      transaction.shippingAddress = {
        city: shippingAddress.city,
        country: shippingAddress.country,
        emailAddress: shippingAddress.email,
        familyName: shippingAddress.lastName,
        givenName: shippingAddress.firstName,
        mobilePhoneNumber: shippingAddress.mobileNumber,
        phoneNumber: shippingAddress.mobileNumber,
        postalState: shippingAddress.state,
        postcode: shippingAddress.zipCode,
        street: shippingAddress.address1 + " " + shippingAddress.address2
      };

      const transactionResponse = await this.transactionService.create(this.config.space_id, transaction);
      const transactionId = transactionResponse.body.id;

      const paymentPageResponse = await transactionPaymentPageService.paymentPageUrl(this.config.space_id, transactionId);
      const pageUrl = paymentPageResponse.body;

      const order = {
        cartItems: cartIds,
        promoCode: promoCode,
        isShpping: isShipping,
        shippingCharge: shippingCharge,
        transactionId: transactionId,
        orderId: generateUniqueIdOrder(),
        isPaid: false,
        discountablePrice,
        payablePrice,
        totalPrice,
        BillingAddress: billingAddress,
        ShippingAddress: shippingAddress,
        orderStatus: "PENDING",
        userId: user?.["id"] || String(userData["_id"])
      }

      await this.orderModel.create(order);

      return { status: HttpStatus.OK, message: "Order Created Successfully", link: pageUrl };
    } catch (error) {
      console.error("Error in payment process:", error);
      if (error.response) {
        console.error("API Response:", error.response.body);
      }
      throw error;
    }
  }


  async findAll(request: Request, paginationDto: PaginationDto) {
    const { page, limit, search, sortColumn, sortOrder, startDate, endDate } = paginationDto
    const query = { isPaid: true, search: new RegExp(search, "i") }
    if (startDate && endDate) {
      query["createdAt"] = { $lte: endDate, $gte: startDate }
    }
    const sort: any = sortColumn ? { sortColumn: sortOrder } : { "_id":-1};
    const orders = await this.orderModel.find(query).sort(sort).skip((page - 1) * limit).limit(limit);
    const count = await this.orderModel.countDocuments(query)
    return {
      status: HttpStatus.OK,
      message: "Data fetched successfully",
      data: orders,
      count
    }
  }

  findOne(request) {
    const webhookData = request.body;

    console.log("✅ Webhook Received from PostFinance");

    // 1. Event Type
    const listenerEntityTechnicalName = webhookData.listenerEntityTechnicalName;
    console.log("Event Type:", listenerEntityTechnicalName);

    // 2. Space ID and Entity ID
    const spaceId = webhookData.spaceId;
    const entityId = webhookData.entityId;

    console.log("Space ID:", spaceId);
    console.log("Entity ID (Transaction ID):", entityId);
    return ("Webhook received")
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
