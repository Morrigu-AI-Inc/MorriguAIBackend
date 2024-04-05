import { Module } from '@nestjs/common';
import { SummarizeTextController } from './summarize_text.controller';
import { ModulesModule } from 'src/agents/modules/modules.module';
import { ModulesService } from 'src/agents/modules/modules.service';
import { BedrockService } from 'src/bedrock/bedrock.service';
import { PromptflagService } from 'src/promptflag/promptflag.service';
import { ActionsService } from 'src/actions/actions.service';
import { Xml2JsonServiceService } from 'src/xml2-json-service/xml2-json-service.service';
import { BuildPromptService } from '../build_prompt/build_prompt.service';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [SummarizeTextController],
  providers: [
    ModulesService,
    BedrockService,
    PromptflagService,
    ActionsService,
    Xml2JsonServiceService,
    BuildPromptService,
  ],
  imports: [DbModule],
})
export class SummarizeTextModule {}
