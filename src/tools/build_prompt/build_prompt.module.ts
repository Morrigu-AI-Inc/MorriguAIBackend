import { Module } from '@nestjs/common';
import { BuildPromptController } from './build_prompt.controller';
import { BuildPromptService } from './build_prompt.service';
import { Xml2JsonServiceService } from 'src/xml2-json-service/xml2-json-service.service';

@Module({
  controllers: [BuildPromptController],
  providers: [BuildPromptService, Xml2JsonServiceService],
  exports: [BuildPromptService],
})
export class BuildPromptModule {}
