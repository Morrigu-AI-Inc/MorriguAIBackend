import { Module } from '@nestjs/common';
import { PlatformService } from './platform.service';
import { PlatformController } from './platform.controller';
import { AssistantsModule } from './assistants/assistants.module';
import { ThreadsModule } from './threads/threads.module';
import { MessagesModule } from './messages/messages.module';
import { RunsModule } from './runs/runs.module';
import { OpenaiModule } from './brains/openai/openai.module';

@Module({
  controllers: [PlatformController],
  providers: [PlatformService],
  imports: [AssistantsModule, ThreadsModule, MessagesModule, RunsModule, OpenaiModule],
})
export class PlatformModule {}
