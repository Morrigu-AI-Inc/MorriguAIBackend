import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  FinancialCategory,
  FinancialCategorySchema,
} from './FinancialCategory';
import { BaseDocument } from './BaseDocument';


export type OperatingModelDocument = OperatingModel & Document;

@Schema()
export class OperatingModel extends BaseDocument {
  @Prop({ type: String, required: true })
  scenario: string;

  @Prop({
    type: [{ type: FinancialCategorySchema, ref: 'FinancialCategory' }],
    default: [],
    ref: 'FinancialCategory',
  })
  income: FinancialCategory[];

  @Prop({
    type: [{ type: FinancialCategorySchema, ref: 'FinancialCategory' }],
    default: [],
    ref: 'FinancialCategory',
  })
  expenses: FinancialCategory[];

  @Prop({
    type: [{ type: FinancialCategorySchema, ref: 'FinancialCategory' }],
    default: [],
    ref: 'FinancialCategory',
  })
  otherFinancials: FinancialCategory[];
}

export const OperatingModelSchema =
  SchemaFactory.createForClass(OperatingModel);
