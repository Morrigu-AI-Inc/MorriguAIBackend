// src/resources/schemas/resource-item.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResourceItemDocument = ResourceItem & Document;

@Schema()
export class ResourceItem {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string; // E.g., "Human", "Financial", "Equipment"

  @Prop()
  description: string;

  @Prop({ required: true })
  totalAvailable: number;

  @Prop()
  unit: string; // Unit of measure (e.g., hours, items, dollars)
}

export const ResourceItemSchema = SchemaFactory.createForClass(ResourceItem);
