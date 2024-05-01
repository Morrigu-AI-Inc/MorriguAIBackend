import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RevenueDataDocument = RevenueData & Document;

@Schema()
export class RevenueData {
  @Prop({ type: Date, required: true })
  date: Date;

  @Prop()
  newCustomers?: number;

  @Prop()
  conversionRate?: number;

  @Prop()
  recurringRevenue?: number;

  @Prop()
  averageRevenuePerUser?: number;

  @Prop()
  churnRate?: number;

  @Prop()
  customerLifetimeValue?: number;

  @Prop()
  salesGrowth?: number;

  @Prop()
  marketingSpend?: number;
}

export const RevenueDataSchema = SchemaFactory.createForClass(RevenueData);
