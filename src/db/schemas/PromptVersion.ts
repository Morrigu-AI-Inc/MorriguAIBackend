import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { randomUUID } from 'crypto';

export type PromptVersionDocument = PromptVersion & Document;

@Schema({ timestamps: true })
export class PromptVersion {
  @Prop({ type: Types.ObjectId, ref: 'Prompt', required: true })
  promptId: Types.ObjectId;

  @Prop({ required: true, default: () => randomUUID() })
  version: string;

  @Prop({ required: true })
  body: string;

  @Prop({ type: Types.ObjectId, ref: 'Organization' })
  owner: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Project' })
  project: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Environment' })
  environment: Types.ObjectId;
}

export const PromptVersionSchema = SchemaFactory.createForClass(PromptVersion);
