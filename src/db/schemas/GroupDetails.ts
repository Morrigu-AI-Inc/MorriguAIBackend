import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Supplier } from './Supplier'; // Assumes a Supplier schema exists
import { PurchaseOrder } from './PurchaseOrder'; // Assumes a PurchaseOrder schema exists

export type GroupDetailsDocument = GroupDetails & Document;

@Schema()
export class PaymentBreakdownEntry {
  @Prop({ type: Types.ObjectId, ref: 'Supplier', required: true })
  participantId: Types.ObjectId;

  @Prop({ required: true })
  fromAmount: number;

  @Prop({ required: true })
  fromCurrency: string;

  @Prop({ required: true })
  toAmount: number;

  @Prop({ required: true })
  toCurrency: string;

  @Prop({ required: true })
  paymentStatus: string;

  @Prop({ required: true })
  paymentDate: Date;
}

@Schema()
export class PaymentBreakdown {
  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true })
  currency: string;

  @Prop([
    { type: Types.ObjectId, ref: 'PaymentBreakdownEntry', required: true },
  ])
  breakdown: PaymentBreakdownEntry[];
}

@Schema({
  timestamps: true,
  versionKey: 'version',
})
export class GroupDetails extends Document {
  @Prop([{ type: Types.ObjectId, ref: 'Supplier', required: true }])
  participants: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'PaymentBreakdown', required: true })
  paymentBreakdown: PaymentBreakdown;

  @Prop({ type: Types.ObjectId, ref: 'PurchaseOrder', required: true })
  purchaseOrder: Types.ObjectId;
}

const GroupDetailsSchema = SchemaFactory.createForClass(GroupDetails);

export default GroupDetailsSchema;
