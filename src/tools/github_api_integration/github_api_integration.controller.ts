import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';

@Controller('tools/github_api_integration')
export class GithubApiIntegrationController {
  constructor() {}

  @Post()
  async postGithubApiIntegration(
    @Body() body: any,
    @Req() req: any,
    @Query('endpoint') endpoint: string,
  ) {
    try {
      return {};
    } catch (error) {
      return {
        error: error,
      };
    }
  }

  @Get()
  async getGithubApiIntegration(
    @Req() req: any,
    @Query('endpoint') endpoint: string,
    @Query('queryParameters') queryParameters: any,
  ) {
    try {
      const fetchOps = {
        method: req.method,
        headers: {
          Authorization: req.headers.authorization.includes('Bearer')
            ? req.headers.authorization
            : `Bearer ${req.headers.authorization}`,
          'Content-Type': 'application/json; charset=utf-8',
        },
      };

      const validPayload = {
        endpoint,
        queryParameters,
      };

      const results = await fetch(
        `${process.env.PARAGON_URL}/sdk/proxy/github/${endpoint}`,
        fetchOps,
      );

      const response = await results.json();

      return response;
    } catch (error) {
      console.error('Error getting Github Api Integration', error);
    }
  }
}
