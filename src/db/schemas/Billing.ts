// billing-plan.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BillingPlanDocument = BillingPlan & Document;
export type TierDocument = Tier & Document;
export type BillingDocument = Billing & Document;

@Schema()
export class BillingPlan {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price_per_seat: number;

  @Prop({ required: true })
  seats: number;

  @Prop({ required: true })
  terminates_at: Date;
}

export const BillingPlanSchema = SchemaFactory.createForClass(BillingPlan);

// tier.schema.ts
@Schema()
export class Tier {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'BillingPlan', required: true })
  billing_plan: Types.ObjectId;
}

export const TierSchema = SchemaFactory.createForClass(Tier);

// billing.schema.ts
@Schema()
export class Billing {
  @Prop({ type: Types.ObjectId, ref: 'BillingPlan', required: true })
  plan: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Tier' })
  tier?: Types.ObjectId;
}

export const BillingSchema = SchemaFactory.createForClass(Billing);
