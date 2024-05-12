import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubscriptionDocument = Subscription & Document;

@Schema()
export class Subscription extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Tier' })
  tier: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' }) // Assuming a User schema exists
  user: Types.ObjectId;

  @Prop({ required: true })
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ required: true, default: true })
  isActive: boolean;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
