import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ThreadMessageDocument = ThreadMessage & Document;

@Schema({
  timestamps: true,
  versionKey: 'version',
})
export class ThreadMessage extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  object: string;

  @Prop({ required: true })
  created_at: number;

  @Prop({ required: true })
  thread_id: string;

  @Prop({ required: false, enum: ['in_progress', 'incomplete', 'completed'] })
  status: string;

  @Prop({ type: Object, required: false })
  incomplete_details: {
    reason: string;
  } | null;

  @Prop({ type: Number, required: false })
  completed_at: number | null;

  @Prop({ type: Number, required: false })
  incomplete_at: number | null;

  @Prop({ required: true, enum: ['user', 'assistant'] })
  role: string;

  @Prop({ required: true, type: [{ type: Object }] })
  content: Array<{
    type: string;
    text?: {
      value: string;
      annotations: Array<{
        type: 'file_citation' | 'file_path';
        text: string;
        file_citation?: {
          file_id: string;
          quote: string;
          start_index: number;
          end_index: number;
        };
        file_path?: {
          file_id: string;
          start_index: number;
          end_index: number;
        };
      }>;
    };
    image_file?: {
      file_id: string;
      detail: string;
    };
    image_url?: {
      url: string;
      detail: string;
    };
  }>;

  @Prop({ type: String, required: false })
  assistant_id: string | null;

  @Prop({ type: String, required: false })
  run_id: string | null;

  @Prop({
    type: [
      {
        file_id: String,
        tools: [
          { type: { type: String, enum: ['file_search', 'code_interpreter'] } },
        ],
      },
    ],
    required: false,
  })
  attachments: Array<{
    file_id: string;
    tools: Array<{ type: string }>;
  }> | null;

  @Prop({ type: Map, of: String, required: false })
  metadata: Map<string, string>;
}

const ThreadMessageSchema = SchemaFactory.createForClass(ThreadMessage);

export default ThreadMessageSchema;
