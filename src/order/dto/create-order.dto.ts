import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsEmail, IsNumber, IsObject, IsOptional, IsString } from "class-validator";

export class Address {
    @ApiProperty()
    @IsString()
    firstName: string

    @ApiProperty()
    @IsString()
    lastName: string

    @ApiProperty()
    @IsString()
    address1: string

    @ApiProperty()
    @IsString()
    address2: string

    @ApiProperty()
    @IsString()
    zipCode: string

    @ApiProperty()
    @IsString()
    country: string

    @ApiProperty()
    @IsString()
    state: string

    @ApiProperty()
    @IsString()
    city: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    deliveryInstruction: string

    @ApiProperty()
    @IsString()
    phoneCode: string

    @ApiProperty()
    @IsString()
    mobileNumber: string

    @ApiProperty()
    @IsEmail()
    email:string
}

export class CreateOrderDto {
    @ApiProperty()
    @IsArray()
    cartIds: string[]

    @ApiProperty()
    @IsNumber()
    totalPrice: number

    @ApiProperty()
    @IsNumber()
    discountablePrice: number

    @ApiProperty()
    @IsNumber()
    payablePrice: number

    @ApiProperty()
    @IsString()
    @IsOptional()
    promoCode: string

    @ApiProperty()
    @IsBoolean()
    isShipping: boolean

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    shippingCharge: number

    @ApiProperty()
    @IsObject()
    shippingAddress: Address

    @ApiProperty()
    @IsObject()
    billingAddress: Address
}


export class PaginationDto{
    @ApiProperty()
    @IsNumber()
    startDate:number

    @ApiProperty()
    @IsNumber()
    endDate:number

    @ApiProperty({required:false})
    @IsString()
    sortColumn?:string

    @ApiProperty({required:false})
    @IsString()
    search?:string

    @ApiProperty({required:false})
    @IsNumber()
    sortOrder?:number

    @ApiProperty()
    @IsNumber()
    page:number

    @ApiProperty()
    @IsNumber()
    limit:number
}