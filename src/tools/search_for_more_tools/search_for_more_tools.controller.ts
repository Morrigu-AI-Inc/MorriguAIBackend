import { Controller, Get, Query } from '@nestjs/common';
import { ToolsService } from '../tools.service';

@Controller('tools/search_for_more_tools')
export class SearchForMoreToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  @Get()
  async searchTools(@Query('parameters') parameters: string): Promise<any> {
    const searchedTools = await this.toolsService.searchTools(
      JSON.parse(parameters).tool_search_query,
    );

    return {
      result: {
        tool_name: 'search_for_more_tools',
        stdout: {
          tools: searchedTools,
        },
      },
    };
  }
}
