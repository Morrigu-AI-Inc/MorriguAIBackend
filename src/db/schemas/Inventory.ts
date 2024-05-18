import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RawMaterial } from './RawMaterial';
import { Warehouse } from './Warehouse';

export type InventoryDocument = Inventory & Document;

@Schema({
  timestamps: true,
  versionKey: 'version',
})
export class Inventory extends Document {
  @Prop({ type: Types.ObjectId, ref: 'RawMaterial', required: true })
  rawMaterial: RawMaterial;

  @Prop({ required: true })
  quantity: number;

  @Prop({ type: Types.ObjectId, ref: 'Warehouse', required: true })
  warehouse: Warehouse;

  @Prop({ required: true })
  lotNumber: string;

  @Prop({ required: true })
  expirationDate: Date;
}

const InventorySchema = SchemaFactory.createForClass(Inventory);

export default InventorySchema;
