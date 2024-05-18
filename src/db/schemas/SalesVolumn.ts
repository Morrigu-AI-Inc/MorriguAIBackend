// src/sales-forecast/schemas/sales-volume.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseDocument } from './BaseDocument';

@Schema()
export class SalesVolume extends BaseDocument {
  @Prop({ required: true })
  period: string; // Format: "YYYY-MM" or "YYYY-QQ" for monthly or quarterly data

  @Prop({ required: true })
  projectedVolume: number; // Estimated number of units expected to be sold

  @Prop({ required: true })
  revenueProjection: number; // Estimated revenue from the projected sales volume

  @Prop()
  basis: string; // Description of the forecasting method, e.g., "historical trend analysis", "regression model", etc.

  @Prop()
  confidenceLevel: number; // A percentage representing the confidence level of the forecast (e.g., 90%)

  @Prop()
  factors: [string]; // Factors considered in the forecast, e.g., market trends, economic indicators, seasonality

  @Prop({ default: Date.now })
  createdAt: Date; // The date when the forecast was created

  @Prop()
  updatedAt: Date; // The date when the forecast was last updated

  @Prop()
  createdBy: string; // Identifier of the user or system that created the forecast

  @Prop()
  updatedBy: string; // Identifier of the user or system that last updated the forecast

  @Prop({ default: false })
  isFinalized: boolean; // Whether the forecast is finalized or still open for revisions
}

export const SalesVolumeSchema = SchemaFactory.createForClass(SalesVolume);
