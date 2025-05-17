import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

export type ProductDocument = Product & Document

export class Attriutes {
    @Prop()
    name: string

    @Prop()
    values: string[]

    @Prop()
    id: string
}

export class Highlights {
    @Prop()
    image: string

    @Prop()
    name: string

    @Prop()
    title: string
}

export class Featured {
    @Prop()
    name: string

    @Prop()
    description: string
}

export class Category {
    @Prop()
    id: string

    @Prop()
    name: string

    @Prop()
    image: string
}

@Schema({
    timestamps: {
        currentTime: () => {
            return Date.now()
        }
    }
})
export class Product {
    _id: mongoose.Schema.Types.ObjectId;

    @Prop()
    title: string;

    @Prop()
    slug: string;

    @Prop()
    description: string;

    @Prop()
    category: Category

    @Prop({ type: [Category] })
    subCategories: Category[]

    @Prop()
    details: string;

    @Prop({ type: Number, default: 0 })
    price: number

    @Prop({ type: Number, default: 0 })
    salePrice: number

    @Prop({ type: [Attriutes] })
    attributes: Attriutes[]

    @Prop({ type: [Highlights] })
    highlights: Highlights[]

    @Prop({ type: [Featured] })
    features: Featured[]

    @Prop({ type: Boolean, default: true })
    isFeatured: boolean

    @Prop({ type: Number, default: 0 })
    scheduleDate: number

    @Prop({ type: [String] })
    images: string

    @Prop({ type: Boolean, default: false })
    isCustomizable: boolean

    @Prop({ type: String })
    mockupImage: string

    @Prop({ type: Boolean, default: false })
    isActive: boolean

    @Prop({ type: Number, default: 0 })
    stars: number

    @Prop({ type: Number, default: 0 })
    totalReviews: number

    @Prop({ type: Number, default: 0 })
    totalOrders: number

    @Prop({ type: Boolean, default: false })
    isDelete: boolean

    @Prop({ type: Number })
    createdAt: number

    @Prop({ type: Number })
    updatedAt: number
}

export const ProductSchema = SchemaFactory.createForClass(Product);
