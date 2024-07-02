import { Controller, Get, Query, Req } from '@nestjs/common';

@Controller('tools/notion_api_integration')
export class NotionApiIntegrationController {
  @Get()
  async notionApiIntegration(
    @Query('payload') payload: string,
    @Req() req: any,
  ) {
    const validPayload = JSON.parse(payload);

    try {
      return {
        message: 'Welcome to the Notion API Integration Tool',
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }
}
