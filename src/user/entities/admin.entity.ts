import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type AdminDocument = Admin & Document;

@Schema({
  timestamps: {
    currentTime: () => {
      return Date.now();
    },
  },
})
export class Admin {
  @Prop({ auto: true })
  _id: mongoose.Schema.Types.ObjectId;

  @Prop()
  email: string;

  @Prop()
  mobileNumber: string;

  @Prop()
  password: string;

  @Prop()
  name: string;

  @Prop()
  createdAt: number;

  @Prop()
  updatedAt: number;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
