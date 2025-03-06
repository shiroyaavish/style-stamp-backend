import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @ApiProperty({ description: "Category Name Eg . Mobile,PhoneCase" })
    name: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "Category Image" })
    image?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "Upper level category id" })
    parentCategoryId?: string

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "Upper level category name" })
    parentCategoryName?: string
}
