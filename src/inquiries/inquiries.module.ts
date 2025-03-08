import { Module } from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { InquiriesController } from './inquiries.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Inquiry, InquirySchema } from './entities/inquiry.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Inquiry.name, schema: InquirySchema }]),
  ],
  controllers: [InquiriesController],
  providers: [InquiriesService],
})
export class InquiriesModule {}
