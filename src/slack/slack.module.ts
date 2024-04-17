import { Module } from '@nestjs/common';
import { SlackService } from './slack.service';
import { SlackController } from './slack.controller';
import { OpenaiService } from 'src/openai/openai.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ExternalSlackMappingSchema } from 'src/db/schemas/ExternalSlackMapping';
import { ToolOutputSchema } from 'src/db/schemas/ToolOutput';
import { AssistantService } from 'src/assistant/assistant.service';

@Module({
  providers: [SlackService, OpenaiService, AssistantService],
  controllers: [SlackController],
  imports: [
    MongooseModule.forFeature([
      { name: 'ExternalSlackMapping', schema: ExternalSlackMappingSchema },
    ]),
    MongooseModule.forFeature([
      { name: 'ToolOutput', schema: ToolOutputSchema },
    ]),
  ],
})
export class SlackModule {}
