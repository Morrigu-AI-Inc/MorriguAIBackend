import { Module } from '@nestjs/common';
import { OpenaiController } from './openai.controller';
import { OpenaiService } from './openai.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ToolOutputSchema } from 'src/db/schemas/ToolOutput';
import { AssistantService } from 'src/assistant/assistant.service';

@Module({
  controllers: [OpenaiController],
  providers: [OpenaiService, AssistantService],
  imports: [
    MongooseModule.forFeature([
      { name: 'ToolOutput', schema: ToolOutputSchema },
    ]),
  ],
})
export class OpenaiModule {}
