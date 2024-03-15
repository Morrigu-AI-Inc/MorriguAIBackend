import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ModelFormattingDocument = ModelFormatting & Document;

@Schema({ timestamps: true, versionKey: false, collection: 'modelformattings' })
export class ModelFormatting {
  @Prop({ required: true })
  system_prefix: string;

  @Prop({ required: true })
  system_suffix: string;

  @Prop({ required: true })
  user_prefix: string;

  @Prop({ required: true })
  user_suffix: string;

  @Prop({ required: true })
  assistant_prefix: string;

  @Prop({ required: true })
  assistant_suffix: string;
}

export const ModelFormattingSchema =
  SchemaFactory.createForClass(ModelFormatting);
