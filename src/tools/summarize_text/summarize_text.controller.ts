import { Controller, Get, Query } from '@nestjs/common';
import { ModulesService } from 'src/agents/modules/modules.service';

@Controller('tools/summarize_text')
export class SummarizeTextController {
  constructor(private readonly moduleService: ModulesService) {}

  @Get()
  async summarizeText(@Query('parameters') parameters: string): Promise<any> {
    parameters = decodeURI(parameters);
    // console.log('parameters', JSON.parse(parameters));
    const response = await this.moduleService.runPrompt([
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Summarize the content:',
          },
          {
            type: 'text',
            text: parameters,
          },
        ],
      },
    ]);

    return {
      result: {
        tool_name: 'summarize_text',
        stdout: JSON.parse(response as string),
      },
    };
  }
}
