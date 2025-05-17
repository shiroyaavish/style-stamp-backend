import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type UserDocument = User & Document;

function customTimestamp(): number {
  return new Date().getTime();
}

@Schema({
  timestamps: {
    currentTime: () => {
      return Date.now();
    },
  },
})
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
  otpExpired: Date;

  @Prop()
  createdAt: number;

  @Prop()
  updatedAt: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
