import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCartDto } from './create-cart.dto';
import { Prop } from '@nestjs/mongoose';
import { IsInt, IsNumber, Min } from 'class-validator';

export class UpdateCartDto extends PartialType(CreateCartDto) {
  @ApiProperty({
    example: 1,
    description: 'The quantity must be at least 1',
    minimum: 1,
  })
  @IsNumber()
  @Min(1, {
    message: "You can't add quantity as 0. It must be 1 or more.",
  })
  quantity: number;
}
