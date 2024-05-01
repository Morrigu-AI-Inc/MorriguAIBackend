import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RevenueData, RevenueDataSchema } from './RevenueData';

export type RevenueModelDocument = RevenueModel & Document;

@Schema()
export class RevenueModel {
  @Prop({ required: true, enum: ['base-case', 'worst-case'] })
  scenario: string;

  @Prop({ type: [RevenueDataSchema], default: [] })
  data: Types.DocumentArray<RevenueData>;
}

export const RevenueModelSchema = SchemaFactory.createForClass(RevenueModel);
