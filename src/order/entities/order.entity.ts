import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type OrderDocument = Order & Document
export class Address {
    @Prop()
    firstName: string

    @Prop()
    lastName: string

    @Prop()
    address1: string

    @Prop()
    address2: string

    @Prop()
    zipCode: string

    @Prop()
    country: string

    @Prop()
    state: string

    @Prop()
    city: string

    @Prop()
    deliveryInstruction: string

    @Prop()
    phoneCode: string

    @Prop()
    mobileNumber: string

}
@Schema({
    timestamps: {
        currentTime: () => {
            return Date.now()
        }
    }
})
export class Order {
    _id: Types.ObjectId

    @Prop()
    cartItems: string[]

    @Prop()
    totalPrice: number

    @Prop()
    discountablePrice: number

    @Prop()
    payablePrice: number

    @Prop()
    promoCode: string

    @Prop()
    isShpping: boolean

    @Prop()
    shippingCharge: number

    @Prop()
    transactionId: string

    @Prop()
    orderId: string

    @Prop()
    userId: string

    @Prop()
    isPaid: boolean

    @Prop()
    BillingAddress: Address

    @Prop()
    ShippingAddress: Address

    @Prop()
    status: string

    @Prop()
    trackingId: string

    @Prop()
    createdAt: number

    @Prop()
    updatedAt: number

}

export const OrderSchema = SchemaFactory.createForClass(Order)
