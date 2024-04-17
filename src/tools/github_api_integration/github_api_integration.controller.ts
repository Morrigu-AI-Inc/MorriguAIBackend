import { Controller, Get, Query } from '@nestjs/common';

@Controller('tools/github_api_integration')
export class GithubApiIntegrationController {
  constructor() {}

  @Get()
  async getGithubApiIntegration(@Query('payload') payload: any) {
    try {
      return true;
    } catch (error) {
      console.error('Error getting Github Api Integration', error);
    }
  }
}
