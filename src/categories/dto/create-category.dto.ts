import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";
import { CategoryDocument } from "../entities/category.entity";
import { Types } from "mongoose";

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

    @IsBoolean()
    @ApiProperty({ description: "category is active or not" })
    isActive?: boolean
}

export class CategoryPaginationDto {
    @IsString()
    @IsOptional()
    @ApiProperty({ description: "Search string", required: false })
    search: string

    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    @ApiProperty({ description: "Page number" })
    page: number

    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    @ApiProperty({ description: "limit of records" })
    limit: number
}
