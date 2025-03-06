import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateInquiryDto, FindInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Inquiry, InquiryDocument } from './entities/inquiry.entity';
import { Model } from 'mongoose';
import { sendEmail } from 'src/utils/mail.utils';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/shared/services/email.service';

@Injectable()
export class InquiriesService {
  constructor(
    @InjectModel(Inquiry.name) private inquiryModel: Model<InquiryDocument>,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService
  ) { }
  async create(createInquiryDto: CreateInquiryDto) {
    const to = this.configService.get<string>("mail.user");

    const sendMail = await this.emailService.sendEmail(to, createInquiryDto);
    return {
      status: HttpStatus.CREATED,
      message:
        'Thank you! Your inquiry has been received. Our team will contact you soon.',
    };
  }

  async findAll(findInquiryDto: FindInquiryDto) {
    const { search, page, limit } = findInquiryDto;
    const query = {};
    if (search) {
      query['$or'] = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
      ];
    }
    const skip = limit * (page - 1);
    const data = await this.inquiryModel
      .find(query)
      .skip(skip)
      .limit(limit + 1);

    const isNextPageAvailable = data.length > limit;

    return {
      status: HttpStatus.OK,
      message: 'Data Found',
      data: {
        data,
        isNextPageAvailable,
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} inquiry`;
  }

  update(id: number, updateInquiryDto: UpdateInquiryDto) {
    return `This action updates a #${id} inquiry`;
  }

  remove(id: number) {
    return `This action removes a #${id} inquiry`;
  }
}
