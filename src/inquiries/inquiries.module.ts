import { Module } from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { InquiriesController } from './inquiries.controller';

@Module({
  imports: [],
  controllers: [InquiriesController],
  providers: [InquiriesService],
})
export class InquiriesModule {}
