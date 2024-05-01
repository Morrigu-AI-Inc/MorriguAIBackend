import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MonthlyFinancialDetailDocument = MonthlyFinancialDetail & Document;

@Schema()
export class MonthlyFinancialDetail {
  @Prop({ type: Date, required: true })
  month: Date;

  @Prop({ type: Number, required: true })
  amount: number;
}

export const MonthlyFinancialDetailSchema = SchemaFactory.createForClass(
  MonthlyFinancialDetail,
);
