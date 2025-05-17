import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAttributeDto {
    @IsString()
    @ApiProperty({ description: "Attribute Name Eg . Color,Size" })
    name: string;

    @IsString()
    @ApiProperty({ description: "Attribute Description" })
    description: string;

    @IsArray()
    @IsString({ each: true })
    @ApiProperty({ description: "Attribute Values" })
    attributes: string[];
}

export class PaginationDto {
    @IsString()
    @IsOptional()
    @ApiProperty({ description: "Search string" ,required:false})
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