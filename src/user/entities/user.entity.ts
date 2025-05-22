import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type UserDocument = User & Document;

function customTimestamp(): number {
  return new Date().getTime();
}
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

  @Prop({type:Address})
  address:Address

  @Prop()
  mobileNumber: string;

  @Prop()
  phoneCode: string;

  @Prop()
  countryCodeEmoji: string;

  @Prop()
  email: string;

  @Prop()
  otp: string;

  @Prop()
  otpExpired: Date;

  @Prop({type:Boolean,default:false})
  isBlocked: boolean;

  @Prop()
  createdAt: number;

  @Prop()
  updatedAt: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
