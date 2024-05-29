import { Module } from '@nestjs/common';
import { GenerativeService } from './generative.service';
import { GenerativeController } from './generative.controller';
import { DbModule } from 'src/db/db.module';
import { AssistantModule } from 'src/assistant/assistant.module';
import { AssistantService } from 'src/assistant/assistant.service';
import { OpenaiService } from 'src/openai/openai.service';
import { OrganizationService } from 'src/organization/organization.service';
import { MediaService } from 'src/media/media.service';

@Module({
  controllers: [GenerativeController],
  providers: [
    GenerativeService,
    AssistantService,
    OpenaiService,
    OrganizationService,
    MediaService
  ],
  imports: [DbModule, AssistantModule],
})
export class GenerativeModule {}
