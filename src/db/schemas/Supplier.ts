import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Organization } from './Organization';
import { RawMaterial } from './RawMaterial';
import { Product } from './Product';

export type SupplierDocument = Supplier & Document;

export interface Location {
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  latitude: number;
  longitude: number;
}

//   supplier: {
//     name: 'Rigu Inc.',
//     description: 'Rigu Inc. offers a range of products and services focused on procurement optimization, supplier management, and logistics. Our tools, such as Rigu Procure and Rigu Supplier Marketplace, enable businesses to compare suppliers, negotiate prices, and manage their procurement data efficiently. Our goal is to strengthen local markets by enhancing supply chain efficiency and enabling smoother transactions.',
//     contact_phone: 'N/A',
//     contact_email: 'N/A',
//     address1: 'N/A',
//     address2: 'N/A',
//     city: 'N/A',
//     state: 'N/A',
//     zip: 'N/A',
//     country: 'N/A',
//     latitude: 0,
//     longitude: 0,
//     rawMaterials: []
//   },

@Schema({
  timestamps: true,
  versionKey: 'version',
})
export class Supplier extends Document implements Location {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false, default: '' })
  description: string;

  @Prop({ required: false, default: '' })
  contactInfo_phone: string;

  @Prop({ required: false, default: '' })
  contactInfo_email: string;

  @Prop({ required: false, default: '' })
  address1: string;

  @Prop({ required: false, default: '' })
  address2: string;

  @Prop({ required: false, default: '' })
  city: string;

  @Prop({ required: false, default: '' })
  state: string;

  @Prop({ required: false, default: '' })
  zip: string;

  @Prop({ required: false, default: '' })
  country: string;

  @Prop({ required: false, default: 0 })
  latitude: number;

  @Prop({ required: false, default: 0 })
  longitude: number;

  @Prop([{ type: Types.ObjectId, ref: 'Product', default: [] }])
  products: Product[];

  @Prop({ type: Types.ObjectId, ref: 'Organization', required: false })
  owner: Organization;

  @Prop([{ type: SchemaTypes.Mixed, default: {} }])
  raw: object;
}

const SupplierSchema = SchemaFactory.createForClass(Supplier);

export default SupplierSchema;
