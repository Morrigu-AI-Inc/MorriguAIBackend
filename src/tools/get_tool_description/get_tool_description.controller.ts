import { Controller, Get, Query } from '@nestjs/common';
import { ToolsService } from '../tools.service';

@Controller('tools/get_tool_description')
export class GetToolDescriptionController {
  constructor(private readonly toolService: ToolsService) {}

  @Get()
  async getToolDescription(
    @Query('parameters') parameters: string,
  ): Promise<any> {
    try {
      const jsonObj = JSON.parse(parameters);
      const toolDescription = await this.toolService.searchTools(
        jsonObj.tool_name,
      );

      return {
        result: {
          tool_name: 'get_tool_description',
          stdout: toolDescription,
        },
      };
    } catch (error) {
      return {
        result: {
          tool_name: 'get_tool_description',
          stdout: `
            <error>
            <message>${error.message}</message>
            </error>
          `,
        },
      };
    }
  }
}
