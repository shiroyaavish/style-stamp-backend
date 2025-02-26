import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type UserDocument = User & Document;

function customTimestamp(): number {
  return new Date().getTime();
}

@Schema()
export class User {
  @Prop({ auto: true })
  _id: mongoose.Schema.Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  address: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  country: string;

  @Prop()
  pincode: string;

  @Prop()
  mobileNumber: string;

  @Prop()
  countryCode: string;

  @Prop()
  countryCodeEmoji: string;

  @Prop()
  email: string;

  @Prop()
  otp: string;

  @Prop()
  islogin: boolean;

  @Prop({ default: customTimestamp })
  createdAt: number;

  @Prop({ default: customTimestamp })
  updatedAt: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
