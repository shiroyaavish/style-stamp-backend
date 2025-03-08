import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import { CreateInquiryDto, FindInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/lib/jwt-auth.guard';

@Controller('inquiries')
@ApiTags('Inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Post()
  @ApiProperty({ description: 'Create inquiries using API' })
  create(@Body() createInquiryDto: CreateInquiryDto) {
    return this.inquiriesService.create(createInquiryDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiProperty({
    description: 'Here you can find all inquiries details using API',
  })
  findAll(@Query() findInquiryDto: FindInquiryDto) {
    return this.inquiriesService.findAll(findInquiryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inquiriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInquiryDto: UpdateInquiryDto) {
    return this.inquiriesService.update(+id, updateInquiryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inquiriesService.remove(+id);
  }
}
