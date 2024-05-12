import { Module } from '@nestjs/common';
import { ChangeAssistantToolController } from './change_assistant_tool.controller';

@Module({
  controllers: [ChangeAssistantToolController]
})
export class ChangeAssistantToolModule {}
