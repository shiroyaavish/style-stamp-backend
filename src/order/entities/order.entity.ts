import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class Order {
    @Prop()
    _id: Types.ObjectId

    @Prop()
    orderItems: string[]

    @Prop()
    totalPrice: number

    @Prop()
    discountablePrice: number

    @Prop()
    payablePrice: number

    @Prop()
    promoCode: string

    @Prop()
    paymentId: string

    @Prop()
    orderId: string

    @Prop()
    isPaid: string

    @Prop()
    orderStatus: string

    @Prop()
    trackingId: string

    @Prop()
    createdAt: number

    @Prop()
    updatedAt: number

}

export const OrderSchema = SchemaFactory.createForClass(Order)
