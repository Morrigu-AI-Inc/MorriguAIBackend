import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  MonthlyFinancialDetail,
  MonthlyFinancialDetailSchema,
} from './MonthlyFinancialDetail';

export type FinancialCategoryDocument = FinancialCategory & Document;

@Schema()
export class FinancialCategory {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: [MonthlyFinancialDetailSchema], default: [] })
  monthlyDetails: MonthlyFinancialDetail[];
}

export const FinancialCategorySchema =
  SchemaFactory.createForClass(FinancialCategory);
