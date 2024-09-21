import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { PurchaseOrder } from './PurchaseOrder';

export type LineItemDocument = LineItem & Document;

@Schema()
export class LineItem extends Document {
  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'PurchaseOrder' })
  po_number: PurchaseOrder;

  @Prop({ required: false })
  productName: string;

  @Prop({ required: false, default: '' })
  description: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  totalPrice: string;

  @Prop({ required: false, type: SchemaTypes.Mixed })
  raw: object;

  @Prop({
    required: false,
    default: 'default',
    enum: ['default', 'amzn_punchout'],
  })
  type?: 'default' | 'amzn_punchout';

  @Prop({ required: false, type: SchemaTypes.Mixed })
  punchoutDefails: any;
}

export const LineItemSchema = SchemaFactory.createForClass(LineItem);
