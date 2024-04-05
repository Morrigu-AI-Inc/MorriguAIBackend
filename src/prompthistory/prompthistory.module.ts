import { Module } from '@nestjs/common';
import { PrompthistoryService } from './prompthistory.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelSchema } from 'src/db/schemas/Model';
import PromptFlag from 'src/db/schemas/PromptFlag';
import { ModelformattingService } from 'src/modelformatting/modelformatting.service';
import { PromptHistorySchema } from 'src/db/schemas/PromptHistory';
import { PromptflagService } from 'src/promptflag/promptflag.service';
import { QueryResponsePairSchema } from 'src/db/schemas/QueryResponsePair';
import { PromptSchema } from 'src/db/schemas/Prompt';
import { QuerySchema } from 'src/db/schemas/Query';
import { QueryResponseSchema } from 'src/db/schemas/QueryResponse';
import { PrompthistoryController } from './prompthistory.controller';

@Module({
  providers: [PrompthistoryService, ModelformattingService, PromptflagService],
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
  controllers: [PrompthistoryController],
})
export class PrompthistoryModule {}
