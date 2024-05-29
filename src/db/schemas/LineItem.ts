import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { PurchaseOrder } from './PurchaseOrder';

export type LineItemDocument = LineItem & Document;

@Schema()
export class LineItem extends Document {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'PurchaseOrder' })
  po_number: PurchaseOrder;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  totalPrice: string;

  @Prop({ required: false, type: SchemaTypes.Mixed })
  raw: object;
}

export const LineItemSchema = SchemaFactory.createForClass(LineItem);
