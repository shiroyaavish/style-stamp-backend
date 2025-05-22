import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";
import { StatusEnum } from "src/constant/status";

export class Category {
    @ApiProperty()
    @IsString()
    id: string

    @ApiProperty()
    @IsString()
    name: string

    @ApiProperty()
    @IsString()
    image: string
}

export class Attriutes {
    @ApiProperty()
    @IsString()
    name: string

    @ApiProperty()
    @IsArray()
    values: string[]

    @ApiProperty()
    @IsString()
    id: string
}


export class Highlights {
    @ApiProperty()
    @IsString()
    image: string

    @ApiProperty()
    @IsString()
    name: string

    @ApiProperty()
    @IsString()
    title: string
}

export class Featured {
    @ApiProperty()
    @IsString()
    name: string

    @ApiProperty()
    @IsString()
    description: string
}

export class CreateProductDto {
    @ApiProperty()
    @IsString()
    title: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string

    @ApiProperty({ default: {}, example: { name: "", id: "", image: "" } })
    category: Category

    @ApiProperty({ default: [], example: [{ name: "", id: "", image: "" }] })
    @IsArray()
    subCategories: [Category]

    @ApiProperty()
    @IsOptional()
    details?: string

    @ApiProperty({ required: true })
    price: number

    @ApiProperty({ required: true })
    salePrice: number

    @ApiProperty({ default: [], example: [{ name: "", values: [], id: "" }] })
    @IsOptional()
    @IsArray()
    attributes?: [Attriutes]

    @ApiProperty({ default: [], example: { image: "", name: "", title: "" } })
    @IsOptional()
    @IsArray()
    highlights?: [Highlights]

    @ApiProperty({ default: [], example: [{ name: "", description: "" }] })
    @IsOptional()
    @IsArray()
    features?: [Featured]

    @ApiProperty({ default: false })
    @IsOptional()
    @IsBoolean()
    isFeatured: boolean

    @ApiProperty({ required: true })
    @IsNumber()
    scheduleDate: number

    @ApiProperty({ default: [] })
    @IsArray()
    @IsOptional()
    images?: string[]

    @ApiProperty({ default: false })
    @IsBoolean()
    isCustomizable: boolean

    @ApiProperty()
    @IsString()
    @IsOptional()
    mockupImage?: string

    @ApiProperty({ default: true })
    @IsString()
    status: StatusEnum
}


export class FindProductByCategoryDto {
    @ApiProperty()
    categoryId: string

    @ApiProperty({ required: false })
    minPrice?: number

    @ApiProperty({ required: false })
    maxPrice?: number

    @ApiProperty({ default: 1, enum: [1, -1], required: false })
    priceLowToHigh?: number

    @ApiProperty({ required: false })
    colors?: string[]

    @ApiProperty({ required: false })
    material?: string[]

    @ApiProperty()
    limit: number

    @ApiProperty()
    page: number
}

export class PaginationDto {
    @ApiProperty()
    categoryId: string[]

    @ApiProperty()
    limit: number

    @ApiProperty()
    page: number

    @ApiProperty()
    sortColumn: string

    @ApiProperty({enum:[1,-1]})
    sortOrder: number
}