import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PostFinanceCheckout } from 'postfinancecheckout';

@Injectable()
export class OrderService {
  private transactionService: PostFinanceCheckout.api.TransactionService;
  private config;
  constructor() {
    let spaceId: number = 80403;
    let userId: number = 136579;
    let apiSecret: string = 'SwHiJvqVmasl1Q01/i/bPWq54deANhejk/d8AbuoLOM=';
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
  async create(createOrderDto: CreateOrderDto) {
    try {
      let transactionPaymentPageService: PostFinanceCheckout.api.TransactionPaymentPageService = new PostFinanceCheckout.api.TransactionPaymentPageService(this.config);


      let lineItem: PostFinanceCheckout.model.LineItemCreate = new PostFinanceCheckout.model.LineItemCreate();
      lineItem.name = "Red T-Shirt";
      lineItem.uniqueId = "5412";
      lineItem.sku = "red-t-shirt-123";
      lineItem.quantity = 1;
      lineItem.amountIncludingTax = 3.5;
      lineItem.type = PostFinanceCheckout.model.LineItemType.PRODUCT;

      let transaction: PostFinanceCheckout.model.TransactionCreate = new PostFinanceCheckout.model.TransactionCreate();
      transaction.lineItems = [lineItem];
      transaction.autoConfirmationEnabled = true;
      transaction.currency = "CHF";

      const response = this.transactionService.create(this.config.space_id, transaction,).then((response) => {
        let transactionCreate: PostFinanceCheckout.model.Transaction = response.body;
        console.log(transactionCreate.id);
        
        transactionPaymentPageService.paymentPageUrl(this.config.space_id, <number>transactionCreate.id).then(function (response) {
          let pageUrl: string = response.body;
          // window.location.href = pageUrl;
          console.log(pageUrl);

        });
      });

      return response;
    } catch (error) {
      console.error("Error in payment process:", error);
      if (error.response) {
        console.error("API Response:", error.response.body);
      }
      throw error; // Re-throw the error to be handled by the calling function
    }
  }

  async findAll(transactionID) {
    console.log(await this.transactionService.read(this.config.space_id, transactionID));

    return "";
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
