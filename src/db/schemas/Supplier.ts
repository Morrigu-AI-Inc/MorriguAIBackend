import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Organization } from './Organization';
import { RawMaterial } from './RawMaterial';

export type SupplierDocument = Supplier & Document;

export interface Location {
  address: string;
  latitude: number;
  longitude: number;
}

@Schema({
  timestamps: true,
  versionKey: 'version',
})
export class Supplier extends Document implements Location {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  contactInfo: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop([{ type: Types.ObjectId, ref: 'RawMaterial' }])
  rawMaterials: RawMaterial[];

  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  organization: Organization
}

const SupplierSchema = SchemaFactory.createForClass(Supplier);

export default SupplierSchema;
