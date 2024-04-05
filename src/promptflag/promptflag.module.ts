import { Module } from '@nestjs/common';
import { PromptflagService } from './promptflag.service';
import { MongooseModule } from '@nestjs/mongoose';
import PromptFlag from 'src/db/schemas/PromptFlag';
import { Model, ModelSchema } from 'src/db/schemas/Model';
import { ModelformattingService } from 'src/modelformatting/modelformatting.service';
import { PromptHistorySchema } from 'src/db/schemas/PromptHistory';
import { PrompthistoryService } from 'src/prompthistory/prompthistory.service';
import { QueryResponsePairSchema } from 'src/db/schemas/QueryResponsePair';
import { PromptSchema } from 'src/db/schemas/Prompt';
import { QuerySchema } from 'src/db/schemas/Query';
import { QueryResponseSchema } from 'src/db/schemas/QueryResponse';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'PromptFlag', schema: PromptFlag }]),
    MongooseModule.forFeature([
      { name: 'ModelFormatting', schema: ModelSchema },
    ]),
    MongooseModule.forFeature([
      { name: 'PromptHistory', schema: PromptHistorySchema },
    ]),
    MongooseModule.forFeature([
      { name: 'QueryResponsePair', schema: QueryResponsePairSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Model', schema: ModelSchema }]),
    MongooseModule.forFeature([{ name: 'Prompt', schema: PromptSchema }]),
    MongooseModule.forFeature([{ name: 'Query', schema: QuerySchema }]),
    MongooseModule.forFeature([
      { name: 'QueryResponse', schema: QueryResponseSchema },
    ]),
  ],

  providers: [PromptflagService, ModelformattingService, PrompthistoryService],
  exports: [PromptflagService],
})
export class PromptflagModule {}
