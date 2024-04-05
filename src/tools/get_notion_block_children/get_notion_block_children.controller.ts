import { Controller, Get } from '@nestjs/common';

@Controller('tools/get_notion_block_children')
export class GetNotionBlockChildrenController {
  @Get()
  async getNotionBlockChildren(): Promise<any> {
    return {
      result: {
        tool_name: 'get_notion_block_children',
        stdout: 'Hello, World!',
      },
    };
  }
}
