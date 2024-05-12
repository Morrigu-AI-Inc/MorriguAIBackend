import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class DatumEntry extends Document {
  @Prop()
  date: string;

  @Prop()
  period: string;

  @Prop({
    type: Object,
    default: {},
  })
  datum: object;

  @Prop()
  company: string;

  @Prop()
  ticker?: string;

  @Prop()
  source: string;
}

export const DatumEntrySchema = SchemaFactory.createForClass(DatumEntry);
