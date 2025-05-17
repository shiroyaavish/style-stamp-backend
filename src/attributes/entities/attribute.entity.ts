import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type AttributeDocument = Attribute & Document

@Schema({
    timestamps: {
        currentTime: () => {
            return Date.now()
        }
    }
})
export class Attribute {
    _id: Types.ObjectId;

    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    attributes: string[];

    @Prop({default:false,type:Boolean})
    isDelete: boolean

    @Prop()
    createdAt: number;

    @Prop()
    updatedAt: number;
}

export const AttributeSchema = SchemaFactory.createForClass(Attribute);
