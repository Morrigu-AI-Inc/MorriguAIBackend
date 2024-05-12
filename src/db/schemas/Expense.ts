// src/expenses/schemas/expense.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseDocument } from './BaseDocument';

export type ExpenseDocument = Expense & Document;
export type ExpenseCategoryDocument = ExpenseCategory & Document;

@Schema()
export class ExpenseCategory extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  color: string;

  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  owner: string;
}

@Schema()
export class Expense extends BaseDocument {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, default: Date.now })
  date: Date;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'ExpenseCategory',
  })
  category: string;

  @Prop()
  description: string;

  // should be an array of urls
  @Prop({ required: true, type: [String] })
  receiptUrl: string[];

  // should be an array of media ids
  @Prop({ required: true, type: [Types.ObjectId], ref: 'Media' })
  media: string[];

  @Prop({ required: false, default: 'User' })
  ownerType: string;

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
  vendor: string;

  @Prop({
    type: 'string',
    enum: ['unsubmitted', 'submitted', 'approved', 'rejected'],
    default: 'unsubmitted',
  })
  status: string;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
export const ExpenseCategorySchema =
  SchemaFactory.createForClass(ExpenseCategory);
