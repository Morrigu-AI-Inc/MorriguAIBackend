import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class BBSubsDataPoint extends Document {
  @Prop({ required: true })
  newBookings: number;

  @Prop({ required: true })
  recurringBookings: number;

  @Prop({ required: true })
  upgrades: number;

  @Prop({ required: true })
  downgrades: number;

  @Prop({ required: true })
  renewals: number;

  @Prop({ required: true })
  cancellations: number;

  @Prop({ required: true })
  totalRevenue: number;

  @Prop({ required: true })
  month: Date;
}

export const BBSubsDataPointSchema =
  SchemaFactory.createForClass(BBSubsDataPoint);
