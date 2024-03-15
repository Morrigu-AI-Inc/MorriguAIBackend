import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { QueryResponsePair } from './QueryResponsePair';
import { User } from './User';
import { PromptFlag } from './PromptFlag';

export type PromptHistoryDocument = PromptHistory & Document;

@Schema({ timestamps: true, collection: 'prompthistories' })
export class PromptHistory {
  @Prop({ type: Types.ObjectId, ref: PromptFlag.name, required: true })
  promptFlagId: Types.ObjectId;

  @Prop([{ type: Types.ObjectId, ref: QueryResponsePair.name }])
  history: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  owner: Types.ObjectId;
}

export const PromptHistorySchema = SchemaFactory.createForClass(PromptHistory);
