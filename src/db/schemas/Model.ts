import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type ModelDocument = Model & Document;

@Schema({ timestamps: true, versionKey: false, strict: false })
export class Model {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['aws', 'openai', 'google', 'azure'] })
  framework: string;

  @Prop({ required: true })
  modelId: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'InferenceParameters' }],
    default: [],
  })
  inference_parameters: Types.ObjectId[];

  @Prop({ type: SchemaTypes.Mixed, required: true })
  inference_params: unknown;

  @Prop({ type: Types.ObjectId, ref: 'ModelFormatting' })
  model_formatting: Types.ObjectId;

  @Prop({ default: true })
  enableHistory: boolean;

  @Prop({ default: true })
  enableStreaming: boolean;

  @Prop({ default: false })
  enableChat: boolean;

  @Prop({ default: false })
  allowUserInterruption: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Organization' })
  owner: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Project' })
  project: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Environment' })
  environment: Types.ObjectId;
}

export const ModelSchema = SchemaFactory.createForClass(Model);
