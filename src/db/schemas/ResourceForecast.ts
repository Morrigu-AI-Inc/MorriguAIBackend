// src/resources/schemas/resource-forecast.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ResourceItem } from './ResourceItem';

export type ResourceForecastDocument = ResourceForecast & Document;

@Schema()
export class ResourceForecast {
  @Prop({ required: true })
  period: string; // E.g., "2024-01", "2024-Q1"

  @Prop({ type: Types.ObjectId, ref: 'ResourceItem' })
  resource: ResourceItem;

  @Prop()
  predictedNeed: number; // Forecasted amount needed

  @Prop()
  notes: string; // Any additional notes or rationale for the forecast
}

export const ResourceForecastSchema =
  SchemaFactory.createForClass(ResourceForecast);
