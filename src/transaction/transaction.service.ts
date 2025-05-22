import { Injectable } from '@nestjs/common';
import { CreateTransactionDto, transactionState } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PostFinanceCheckout } from 'postfinancecheckout';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from 'src/order/entities/order.entity';
import { Model, Types } from 'mongoose';
import { Cart, CartDocumnet } from 'src/carts/entities/cart.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TransactionService {

  private transactionService: PostFinanceCheckout.api.TransactionService;
  private config;
  constructor(
    private configService: ConfigService,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Cart.name) private cartModel: Model<CartDocumnet>
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
  async create(createTransactionDto: CreateTransactionDto) {

    const transactionId = createTransactionDto.entityId;
    const spaceId = createTransactionDto.spaceId;

    const transaction = await this.transactionService.read(spaceId, transactionId)
    const order = await this.orderModel.findOne({ transactionId: transactionId });
    const isPaid = transaction.body.state === PostFinanceCheckout.model.TransactionState.FULFILL
    await this.orderModel.findByIdAndUpdate(order._id, { isPaid: isPaid ? true : false, status: isPaid ? "CONFIRMED":"FAILED" })

    await this.cartModel.updateMany({ _id: order.cartItems.map((id) => new Types.ObjectId(id)) }, { orderId: String(order._id), order: order.orderId, isOrder: true })

    return createTransactionDto;
  }

  findAll() {
    return `This action returns all transaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
