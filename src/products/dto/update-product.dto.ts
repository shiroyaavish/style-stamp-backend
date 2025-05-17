import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsArray, IsOptional } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @ApiProperty()
    @IsArray()
    @IsOptional()
    deletedImages: string[]
}
