import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { StatusEnum } from "src/constant/status";

export type CategoryDocument = Category & Document

@Schema({
    timestamps: {
        currentTime: () => {
            return Date.now();
        }
    }
})
export class Category {
    @Prop({ type: String })
    name: string

    @Prop({ type: String })
    image: string

    @Prop({ type: String, default: null })
    parentCategoryId: string

    // @Prop({ type: [mongoose.Schema.Types.ObjectId], default: [] })
    // childs: mongoose.Schema.Types.ObjectId[]
    @Prop({ type: String, default: StatusEnum.Deactive })
    status: StatusEnum

    @Prop({ type: Boolean, default: false })
    isDelete: boolean

    @Prop({ type: [String], default: [] })
    path: string[];

    @Prop({ type: Number })
    createdAt: number

    @Prop({ type: Number })
    updatedAt: number
}

export const CategorySchema = SchemaFactory.createForClass(Category)