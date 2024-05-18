import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Supplier } from './Supplier';

export type RawMaterialDocument = RawMaterial & Document;

@Schema({
  timestamps: true,
  versionKey: 'version',
})
export class RawMaterial extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  unit: string; // e.g., kilograms, liters, etc.

  @Prop({ required: true })
  costPerUnit: number;

  @Prop([{ type: Types.ObjectId, ref: 'Supplier' }])
  suppliers: Supplier[];
}

const RawMaterialSchema = SchemaFactory.createForClass(RawMaterial);

export default RawMaterialSchema;
