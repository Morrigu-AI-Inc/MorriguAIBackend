import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VendorDocument = Vendor & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Vendor extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address1: string;

  @Prop({ required: false })
  address2: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  zipCode: string;

  @Prop({ required: true })
  contactNumber: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, default: false })
  isDeleted: boolean;
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);
