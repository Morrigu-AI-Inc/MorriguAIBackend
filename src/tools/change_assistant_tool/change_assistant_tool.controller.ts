import { Controller, Get, Query } from '@nestjs/common';

@Controller('tools/change_assistant_tool')
export class ChangeAssistantToolController {
  constructor() {}

  @Get()
  async getChangeAssistantTool(
    @Query('payload') payload: string,
  ): Promise<any> {
    const json = JSON.parse(JSON.parse(payload));

    return { message: 'getChangeAssistantTool', json };
  }
}
