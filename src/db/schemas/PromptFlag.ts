import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'promptflags' })
export class PromptFlag {
  @Prop({ type: Types.ObjectId, ref: 'Prompt', required: true })
  promptId: Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Environment', required: true })
  environment: string;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  project: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  owner: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ type: String })
  createdAt: string;

  @Prop({ type: String })
  updatedAt: string;
}

export type PromptFlagDocument = PromptFlag & Document;

export default SchemaFactory.createForClass(PromptFlag);
