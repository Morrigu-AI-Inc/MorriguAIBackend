import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({
  timestamps: { createdAt: 'created_at' },
  versionKey: false,
})
export class Message extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true, enum: ['user', 'assistant'] })
  role: string;

  @Prop({ type: Types.ObjectId, required: true })
  thread_id: string;

  @Prop({ required: true, type: [{ type: Object }] })
  content: Array<{
    type: string;
    text: { value: string; annotations: Array<any> };
  }>;

  @Prop([{ type: Types.ObjectId, ref: 'Attachment' }])
  attachments: Types.ObjectId[];

  @Prop({ required: false, ref: 'Media' })
  media: Types.ObjectId;

  @Prop({ type: Map, of: String })
  metadata: Record<string, string>;

  @Prop({ required: true, ref: 'User' })
  owner: string;
}

const MessageSchema = SchemaFactory.createForClass(Message);

export default MessageSchema;
