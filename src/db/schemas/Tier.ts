import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TierDocument = Tier & Document;

@Schema()
export class Tier extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: [] })
  features: string[];
}

export const TierSchema = SchemaFactory.createForClass(Tier);
