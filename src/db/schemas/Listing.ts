import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { UserDocument, UserSchema } from './User';
import * as yup from 'yup';

export type ListingDocument = Listing & Document;

export const ListingValidation = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().required(),
  price: yup.string().required(),
  bedrooms: yup.string().required(),
  bathrooms: yup.string().required(),
  location: yup.string().required(),
  images: yup.array().of(yup.string()).required().default([]),
  data: yup.object().required().default({}),
  area: yup.string().required(),
  amenities: yup.string().required(),
  agent: yup.object().required(),
  contact: yup.object().required().default({}),
});

export const ListingValidationAI = yup.object().shape({
  title: yup.string().required(`'title' is required. (string)`),
  description: yup.string().required(`'description' is required. (string)`),
  price: yup.string().required(`'price' is required. (string)`),
  bedrooms: yup.string().required(`'bedrooms' is required. (string)`),
  bathrooms: yup.string().required(`'bathrooms' is required. (string)`),
  location: yup.string().required(`'location' is required. (string)`),
  images: yup.array().of(yup.string()).default([]),
  data: yup.object().default({}),
  area: yup.string().required(`'area' (sqft) is required. (string)`),
  amenities: yup.string().required(`'amenities' is required. (string)`),
});

@Schema({
  timestamps: true,
  versionKey: false,
  strict: false,
})
export class Listing extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: string;

  @Prop({ required: true })
  bedrooms: string;

  @Prop({ required: true })
  bathrooms: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true, default: [] })
  images: string[];

  @Prop({ type: SchemaTypes.Mixed, required: true, default: {} })
  data: any;

  // Additional properties
  @Prop({ required: true })
  area: string;

  @Prop({ required: true })
  amenities: string;

  @Prop({
    required: false,
    ref: 'User',
    type: UserSchema,
  })
  agent: UserDocument;

  @Prop({
    required: false,
    ref: 'User',
    type: UserSchema,
  })
  contact: string;
}

export const ListingSchema = SchemaFactory.createForClass(Listing);
