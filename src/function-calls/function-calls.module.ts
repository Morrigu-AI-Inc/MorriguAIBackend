import { Module, Logger } from '@nestjs/common';
import { FunctionCallsService } from './function-calls.service';
import { Xml2JsonServiceService } from 'src/xml2-json-service/xml2-json-service.service';
import { ActionsService } from 'src/actions/actions.service';
import { BedrockService } from 'src/bedrock/bedrock.service';
import { PromptflagModule } from 'src/promptflag/promptflag.module';
import { PromptflagService } from 'src/promptflag/promptflag.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelSchema } from 'src/db/schemas/Model';
import { PromptSchema } from 'src/db/schemas/Prompt';
import PromptFlag from 'src/db/schemas/PromptFlag';
import { PromptHistorySchema } from 'src/db/schemas/PromptHistory';
import { QueryResponsePairSchema } from 'src/db/schemas/QueryResponsePair';
import { ToolsModule } from 'src/tools/tools.module';
import { ToolDescriptionSchema } from 'src/db/schemas/Tools';
import { BuildPromptService } from 'src/tools/build_prompt/build_prompt.service';

@Module({
  providers: [
    FunctionCallsService,
    Xml2JsonServiceService,
    ActionsService,
    BedrockService,
    PromptflagModule,
    PromptflagService,
    ToolsModule,
    Logger,
    BuildPromptService,
  ],
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
    MongooseModule.forFeature([
      { name: 'ToolDescription', schema: ToolDescriptionSchema },
    ]),
  ],
})
export class FunctionCallsModule {}
