import { Controller, Get } from '@nestjs/common';
import { AnthropicService } from './anthropic.service';

@Controller('anthropic')
export class AnthropicController {
  constructor(private readonly anthropicService: AnthropicService) {}
  @Get()
  async getAnthropic(): Promise<any> {
    const resp = await this.anthropicService.runPromptWithToolsNonStreaming();

    console.log(resp);
    return {
      result: {
        tool_name: 'anthropic',
        stdout: 'Hello, World!',
      },
    };
  }
}
