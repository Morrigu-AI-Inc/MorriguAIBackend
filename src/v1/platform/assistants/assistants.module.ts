import { Module } from '@nestjs/common';
import { AssistantsService } from './assistants.service';
import { AssistantsController } from './assistants.controller';
import { OpenaiService } from 'src/openai/openai.service';
import { DbModule } from 'src/db/db.module';
import { GenerativeService } from 'src/generative/generative.service';
import { OpenaiModule } from 'src/openai/openai.module';
import { AssistantService } from 'src/assistant/assistant.service';
import { OrganizationService } from 'src/organization/organization.service';
import { MediaService } from 'src/media/media.service';

@Module({
  controllers: [AssistantsController],
  providers: [
    AssistantsService,
    OpenaiService,
    AssistantService,
    OrganizationService,
    MediaService
  ],
  imports: [DbModule]
})
export class AssistantsModule {}
