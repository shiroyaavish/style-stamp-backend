import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { StatusEnum } from "src/constant/status";

export type CartDocumnet = Cart & Document

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
export class Cart {
    _id: Types.ObjectId

    @Prop()
    userId: string

    @Prop()
    productId: string

    @Prop()
    title: string

    @Prop({type:Object})
    attributes:object

    @Prop()
    category: Category

    @Prop()
    descroiption: string

    @Prop({ default: 1 })
    quantity: number

    @Prop()
    price: number

    @Prop()
    salePrice: number

    @Prop()
    totalAmount: number

    @Prop()
    images: string[]

    @Prop({ default: false })
    isCustomizable: boolean

    @Prop()
    mockupImage: string

    @Prop()
    originalImage: string

    @Prop()
    customizedImage: string

    @Prop()
    orderId: string

    @Prop()
    order: string

    @Prop({ default: false })
    isOrder: boolean

    @Prop({ default: StatusEnum.Active,type:String })
    status: StatusEnum

    @Prop()
    createdAt:number

    @Prop()
    updatedAt:number
}

export const CartSchema = SchemaFactory.createForClass(Cart);