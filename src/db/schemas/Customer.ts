import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Lead } from './Lead';

@Schema()
export class Customer extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Lead', required: true })
  leadId: Lead;

  @Prop({ default: Date.now })
  conversionDate: Date;

  @Prop({ required: true })
  lifetimeValue: number;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
