import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ObjectWatcher extends Document {
  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  watchCode: string; // Code to watch, e.g., HS6, HS10, or other types

  @Prop({ required: true })
  watchType: string; // e.g., 'commodity', 'category', 'vendor', etc.

  @Prop({ required: true })
  notificationType: string; // e.g., 'email', 'sms', etc.

  @Prop()
  lastNotifiedAt: Date;
}

export const ObjectWatcherSchema = SchemaFactory.createForClass(ObjectWatcher);
