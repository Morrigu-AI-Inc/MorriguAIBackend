import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type InferenceParametersDocument = InferenceParameters & Document;

@Schema({ timestamps: true, versionKey: false })
export class InferenceParameters {
  @Prop({ type: SchemaTypes.Mixed, required: true })
  value: string | number | Array<string | number>;

  @Prop({ required: true })
  key: string;
}

export const InferenceParametersSchema =
  SchemaFactory.createForClass(InferenceParameters);
