import { Module } from '@nestjs/common';
import { AnthropicService } from './anthropic.service';
import { AnthropicController } from './anthropic.controller';

@Module({
  providers: [AnthropicService],
  controllers: [AnthropicController]
})
export class AnthropicModule {}
