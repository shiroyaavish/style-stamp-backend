import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsObject, IsOptional, IsString } from "class-validator"

export class CreateCartDto {
    @ApiProperty()
    @IsString()
    productId: string

    @ApiProperty()
    @IsObject()
    attributes: object

    @IsBoolean()
    @ApiProperty({ default: false })
    @IsOptional()
    isCustomizable?: boolean

    @IsString()
    @ApiProperty()
    @IsOptional()
    mockupImage?: string

    @IsString()
    @ApiProperty()
    @IsOptional()
    originalImage?: string

    @IsString()
    @ApiProperty()
    @IsOptional()
    customizedImage?: string
}
