// src/hiring-plans/schemas/hiring-plan.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Organization } from './Organization';

@Schema()
export class HiringPlan extends Document {
  @Prop({ required: true })
  startDate: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Employee' }] })
  currentEmployees: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Employee' }] })
  futureEmployees: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  owner: Organization;
}

export const HiringPlanSchema = SchemaFactory.createForClass(HiringPlan);
