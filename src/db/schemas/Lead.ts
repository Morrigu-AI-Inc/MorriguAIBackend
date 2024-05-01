import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Lead extends Document {
  @Prop({ required: true })
  source: string;

  @Prop({ default: Date.now })
  dateGenerated: Date;

  @Prop({ default: false })
  isConverted: boolean;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
