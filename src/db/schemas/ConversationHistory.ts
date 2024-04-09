// conversationhistory.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatMessageContent = {
  type: 'text' | 'tool_use' | 'tool_result' | 'image';
  text: string;
  id?: string;
  input?: Record<string, any>;
  source?: {
    type: 'base64';
    media_type: string;
    data: string;
  };
};

export type ChatMessageType = {
  model?: string;
  stop_reason?: string;
  role: 'user' | 'assistant';
  content: ChatMessageContent[];
};

type HistoryType = {
  name: string;
  messages: ChatMessageType[];
  description: string;
};

export type ChatMessageDocument = ChatMessageType & Document;
export type HistoryDocument = HistoryType & Document;

@Schema({ timestamps: true })
export class ChatMessage {
  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  stop_reason: string;

  @Prop({ required: true })
  role: 'user' | 'assistant';

  @Prop({ type: [Object], required: true })
  content: ChatMessageContent[];
}

@Schema({ timestamps: true })
export class History {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [ChatMessage], default: [] })
  messages: ChatMessage[];
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
export const HistorySchema = SchemaFactory.createForClass(History);
