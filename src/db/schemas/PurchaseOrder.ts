import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Supplier } from './Supplier';
import { RawMaterial } from './RawMaterial';

export type PurchaseOrderDocument = PurchaseOrder & Document;

@Schema({
  timestamps: true,
  versionKey: 'version',
})
export class PurchaseOrder extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Supplier', required: true })
  supplier: Supplier;

  @Prop([{ type: Types.ObjectId, ref: 'RawMaterial', required: true }])
  rawMaterials: RawMaterial[];

  @Prop({ required: true })
  orderDate: Date;

  @Prop({ required: true })
  deliveryDate: Date;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true })
  status: string;
}

const PurchaseOrderSchema = SchemaFactory.createForClass(PurchaseOrder);

export default PurchaseOrderSchema;
