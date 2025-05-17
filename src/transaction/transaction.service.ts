import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PostFinanceCheckout } from 'postfinancecheckout';

@Injectable()
export class TransactionService {

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
  async create(createTransactionDto: CreateTransactionDto) {
    // {"entityId":261024279,"eventId":601947196,"listenerEntityId":1472041831364,"listenerEntityTechnicalName":"TransactionCompletion","spaceId":80403,"timestamp":"2025-05-17T08:36:00+0000","webhookListenerId":550330}



    console.log("🚨 Webhook Event Received:");
    console.log(JSON.stringify(createTransactionDto, null, 2));

    const entityType = createTransactionDto.listenerEntityTechnicalName;
    const transactionId = createTransactionDto.entityId;
    const spaceId = createTransactionDto.spaceId;

    // Use the API to fetch full transaction details (optional)
    console.log("📦 Transaction ID:", transactionId);
    console.log("🌌 Space ID:"
      , spaceId);
    const transaction = await this.transactionService.read(spaceId, transactionId)
    console.log(transaction.body.state);
    // const document = await this.transactionService.getInvoiceDocument(spaceId, transactionId);
    // console.log(document);


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
