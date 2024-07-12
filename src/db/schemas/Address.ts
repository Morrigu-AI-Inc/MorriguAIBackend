import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AddressDocument = Address & Document;

@Schema()
export class Address {
  @Prop({
    required: true,
  })
  name: string; // Optional field for a name to identify the address

  @Prop({ required: true })
  street: string;

  @Prop({})
  street2: string; // Optional field for apartment numbers, etc.

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  postalCode: string;

  @Prop({ required: true })
  country: string;

  @Prop()
  additionalInfo?: string; // Optional field for apartment numbers, etc.

  // Organization
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Organization',
  })
  owner: Types.ObjectId;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
