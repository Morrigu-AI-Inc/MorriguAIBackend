import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import PromptFlagSchema from './schemas/PromptFlag';
import { MediaSchema } from './schemas/Media';
import { ModelFormattingSchema } from './schemas/ModelFormatting';
import { PromptHistorySchema } from './schemas/PromptHistory';
import { QueryResponseSchema } from './schemas/QueryResponse';
import { QueryResponsePairSchema } from './schemas/QueryResponsePair';
import { ModelSchema } from './schemas/Model';
import { PromptSchema } from './schemas/Prompt';
import {
  ChatMessageSchema,
  HistorySchema,
} from './schemas/ConversationHistory';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'PromptFlag',
        schema: PromptFlagSchema,
        collection: 'promptFlags',
      },
    ]),
    MongooseModule.forFeature([
      { name: 'ModelFormatting', schema: ModelFormattingSchema },
    ]),
    MongooseModule.forFeature([
      { name: 'PromptHistory', schema: PromptHistorySchema },
    ]),
    MongooseModule.forFeature([
      { name: 'QueryResponse', schema: QueryResponseSchema },
    ]),
    MongooseModule.forFeature([
      { name: 'QueryResponsePair', schema: QueryResponsePairSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Model', schema: ModelSchema }]),
    MongooseModule.forFeature([{ name: 'Prompt', schema: PromptSchema }]),
    MongooseModule.forFeature([{ name: 'History', schema: HistorySchema }]),
    MongooseModule.forFeature([
      { name: 'ChatMessage', schema: ChatMessageSchema },
    ]),
  ],
  exports: [
    MongooseModule.forFeature([
      { name: 'PromptFlag', schema: PromptFlagSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Media', schema: MediaSchema }]),
    MongooseModule.forFeature([
      { name: 'ModelFormatting', schema: ModelFormattingSchema },
    ]),
    MongooseModule.forFeature([{ name: 'History', schema: HistorySchema }]),
    MongooseModule.forFeature([
      { name: 'ChatMessage', schema: ChatMessageSchema },
    ]),
  ],
})
export class DbModule {}
