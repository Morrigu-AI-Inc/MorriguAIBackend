import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  FinancialCategory,
  FinancialCategorySchema,
} from './FinancialCategory';

export type OperatingModelDocument = OperatingModel & Document;

@Schema()
export class OperatingModel {
  @Prop({ type: String, required: true })
  scenario: string;

  @Prop({ type: [FinancialCategorySchema], default: [] })
  income: FinancialCategory[];

  @Prop({ type: [FinancialCategorySchema], default: [] })
  expenses: FinancialCategory[];

  @Prop({ type: [FinancialCategorySchema], default: [] })
  otherFinancials: FinancialCategory[];
}

export const OperatingModelSchema =
  SchemaFactory.createForClass(OperatingModel);
