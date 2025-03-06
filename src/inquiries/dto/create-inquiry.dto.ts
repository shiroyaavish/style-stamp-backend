import { ApiProperty } from '@nestjs/swagger';

export class CreateInquiryDto {
  @ApiProperty({ description: 'First Name Of User' })
  firstName: string;

  @ApiProperty({ description: 'Last Name Of User' })
  lastName: string;

  @ApiProperty({ description: 'Email Of The User' })
  email: string;

  @ApiProperty({ description: 'Lines Of Message' })
  message: string;
}

export class FindInquiryDto {
  @ApiProperty({
    description: 'User Can Search With Email And Username',
    required: false,
  })
  search: string;

  @ApiProperty({ description: 'page number' })
  page: number;

  @ApiProperty({ description: 'limits of records' })
  limit: number;
}
