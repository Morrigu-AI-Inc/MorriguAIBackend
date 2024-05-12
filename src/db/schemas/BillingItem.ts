import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BillingItemDocument = BillingItem & Document;

@Schema()
export class BillingItem extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Subscription' })
  subscription: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  billingDate: Date;

  @Prop({ required: true })
  nextBillingDate: Date;

  @Prop()
  transactionId: string; // External transaction ID if applicable
}

export const BillingItemSchema = SchemaFactory.createForClass(BillingItem);
