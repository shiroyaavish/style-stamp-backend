import { Test, TestingModule } from '@nestjs/testing';
import { InquiriesController } from './inquiries.controller';
import { InquiriesService } from './inquiries.service';

describe('InquiriesController', () => {
  let controller: InquiriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InquiriesController],
      providers: [InquiriesService],
    }).compile();

    controller = module.get<InquiriesController>(InquiriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
