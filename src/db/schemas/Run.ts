import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RunDocument = Run & Document;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: false },
  versionKey: false,
})
export class Run extends Document {
  @Prop({ required: true })
  assistant_id: string;

  @Prop({ required: true })
  thread_id: string;

  @Prop({ required: true })
  status: string;

  @Prop({ type: Date, default: null })
  started_at: Date | null;

  @Prop({ type: Date, default: null })
  expires_at: Date | null;

  @Prop({ type: Date, default: null })
  cancelled_at: Date | null;

  @Prop({ type: Date, default: null })
  failed_at: Date | null;

  @Prop({ type: Date, default: null })
  completed_at: Date | null;

  @Prop({ type: Object, default: null })
  required_action: Record<string, any> | null;

  @Prop({ type: Object, default: null })
  last_error: Record<string, any> | null;

  @Prop({ type: String, default: null })
  instructions: string | null;

  @Prop({ type: Array, default: [] })
  tools: { type: string }[];

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;

  @Prop({ type: Object, default: null })
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  } | null;

  @Prop({ type: Number, default: 1 })
  temperature: number;

  @Prop({ type: Number, default: 1 })
  top_p: number;

  @Prop({ type: Number, default: null })
  max_prompt_tokens: number | null;

  @Prop({ type: Number, default: null })
  max_completion_tokens: number | null;

  @Prop({ type: Object, default: {} })
  truncation_strategy: {
    type: string;
    last_messages: string | null;
  };

  @Prop({ type: String, default: 'auto' })
  tool_choice: string | object;

  @Prop({ type: String, default: 'auto' })
  response_format: string | object;
}

const RunSchema = SchemaFactory.createForClass(Run);

export default RunSchema;
