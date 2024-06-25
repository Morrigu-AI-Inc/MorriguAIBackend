import { Module } from '@nestjs/common';
import { ThreadsService } from './threads.service';
import { ThreadsController } from './threads.controller';

import { DbModule } from 'src/db/db.module';
import { AssistantModule } from 'src/assistant/assistant.module';
import { AssistantService } from 'src/assistant/assistant.service';
import { OpenaiService } from 'src/openai/openai.service';
import { OrganizationService } from 'src/organization/organization.service';
import { MediaService } from 'src/media/media.service';

@Module({
  controllers: [ThreadsController],
  providers: [
    ThreadsService,
    AssistantService,
    OpenaiService,
    OrganizationService,
    MediaService,
  ],
  imports: [DbModule, AssistantModule],
})
export class ThreadsModule {}
