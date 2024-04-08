import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActionsService } from 'src/actions/actions.service';
import { AnthropicService } from 'src/anthropic/anthropic.service';
import { MediaSchema } from 'src/db/schemas/Media';
import { ModelSchema } from 'src/db/schemas/Model';
import { ModelFormattingSchema } from 'src/db/schemas/ModelFormatting';
import { PromptSchema } from 'src/db/schemas/Prompt';
import PromptFlag from 'src/db/schemas/PromptFlag';
import { PromptHistorySchema } from 'src/db/schemas/PromptHistory';
import { QuerySchema } from 'src/db/schemas/Query';
import { QueryResponseSchema } from 'src/db/schemas/QueryResponse';
import { QueryResponsePairSchema } from 'src/db/schemas/QueryResponsePair';
import { MediaService } from 'src/media/media.service';
import { ModelformattingService } from 'src/modelformatting/modelformatting.service';
import { PromptflagService } from 'src/promptflag/promptflag.service';
import { PrompthistoryService } from 'src/prompthistory/prompthistory.service';
import { BuildPromptService } from 'src/tools/build_prompt/build_prompt.service';
import { Xml2JsonServiceService } from 'src/xml2-json-service/xml2-json-service.service';

@Module({
  providers: [
    PromptflagService,
    ModelformattingService,
    ActionsService,
    Xml2JsonServiceService,
    BuildPromptService,
    PrompthistoryService,
    MediaService,
    AnthropicService,
  ],
  controllers: [],
  imports: [
    MongooseModule.forFeature([{ name: 'PromptFlag', schema: PromptFlag }]),
    MongooseModule.forFeature([
      { name: 'ModelFormatting', schema: ModelFormattingSchema },
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
    MongooseModule.forFeature([{ name: 'Media', schema: MediaSchema }]),
  ],
  exports: [
    PromptflagService,
    ModelformattingService,
    ActionsService,
    Xml2JsonServiceService,
    BuildPromptService,
    PrompthistoryService,
    MediaService,
  ],
})
export class BedrockModule {}
