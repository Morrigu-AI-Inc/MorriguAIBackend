import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { RevenueData, RevenueDataSchema } from './RevenueData';
import { BaseDocument } from './BaseDocument';

export type RevenueModelDocument = RevenueModel & Document;

@Schema()
export class RevenueModel extends BaseDocument {
  @Prop({ required: true, enum: ['base-case', 'worst-case'] })
  scenario: string;

  @Prop({ type: [{ ref: 'RevenueData', type: Types.ObjectId }] })
  data: RevenueData[];
}

export const RevenueModelSchema = SchemaFactory.createForClass(RevenueModel);
