import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './User';

export type ThreadDocument = Thread & Document;

@Schema()
export class Thread extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ type: Object, default: null })
  meta: Record<string, any>;

  @Prop({ required: true })
  object: string;

  @Prop({ required: true })
  created_at: number;

  @Prop({ type: Object, default: null })
  tool_resources: Record<string, any> | null;

  @Prop({ type: Map, of: String, default: {} })
  metadata: Map<string, string>;

  @Prop({ required: false, type: String })
  alternate_instructions: string;

  @Prop({ required: false, type: Types.ObjectId, ref: 'User' })
  owner: string;
}

const ThreadSchema = SchemaFactory.createForClass(Thread);

export default ThreadSchema;
