import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StripeAccountDocument = StripeAccount & Document;

@Schema()
export class StripeAccount {
  @Prop({ required: true })
  stripeCustomerId: string;

  @Prop({ type: [String], default: [] })
  accountIds: string[]; // Array of Stripe payment source IDs
}

export const StripeAccountSchema = SchemaFactory.createForClass(StripeAccount);
