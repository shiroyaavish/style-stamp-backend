import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

export type AuthInfoDocument = AuthInfo & Document

function customTimestamp(): number {
    return new Date().getTime();
}


@Schema()
export class AuthInfo {
    @Prop({auto:true})
    _id:mongoose.Schema.Types.ObjectId;

    @Prop()
    uniqueId:string

    @Prop()
    refreshToken:string

    @Prop()
    accessToken:string

    @Prop()
    userId:string

    @Prop()
    userMobileNumber:string

    @Prop({default:customTimestamp})
    createdAt:number

    @Prop({default:customTimestamp})
    updatedAt:number
}

export const authInfoSchema = SchemaFactory.createForClass(AuthInfo)