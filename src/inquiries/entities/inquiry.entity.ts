import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type InquiryDocument = Inquiry & Document;

@Schema({
  timestamps: {
    currentTime: () => {
      return Date.now();
    },
  },
})
export class Inquiry {
  @Prop({ auto: true })
  _id: mongoose.Schema.Types.ObjectId;

  @Prop()
  name: String;

  @Prop()
  email: string;

  @Prop()
  message: string;

  @Prop()
  createdAt: number;

  @Prop()
  updatedAt: number;
}

export const InquirySchema = SchemaFactory.createForClass(Inquiry);
