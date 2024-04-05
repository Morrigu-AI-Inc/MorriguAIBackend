import { Controller, Get } from '@nestjs/common';

@Controller('tools/get_notion_block')
export class GetNotionBlockController {
  @Get()
  async getNotionBlock(): Promise<any> {
    return {
      result: {
        tool_name: 'get_notion_block',
        stdout: 'Hello, World!',
      },
    };
  }
}
