import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';

@Controller('tools/slack_api_integration')
export class SlackApiIntegrationController {
  @Post()
  async slackApiIntegrationPost(
    @Body() body,
    @Req() req,
    @Query('endpoint') endpoint: string,
    @Query('method') method: string,
  ) {
    try {
      const fetchOps = {
        method: method,
        headers: {
          Authorization: req.headers.authorization.includes('Bearer')
            ? req.headers.authorization
            : `Bearer ${req.headers.authorization}`,
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(body),
      };

      const results = await fetch(
        `${process.env.PARAGON_URL}/sdk/proxy/slack/${endpoint}`,
        fetchOps,
      );

      const response = await results.json();

      return response;
    } catch (error) {
      return {
        error: error,
      };
    }
  }

  @Get()
  async slackApiIntegration(
    @Query('endpoint') endpoint: any,
    @Req() req,
    @Query('method') method: any,
    @Query('queryParameters') queryParameters: any,
  ) {
    try {
      const fetchOps = {
        method: method,
        headers: {
          Authorization: req.headers.authorization.includes('Bearer')
            ? req.headers.authorization
            : `Bearer ${req.headers.authorization}`,
          'Content-Type': 'application/json; charset=utf-8',
        },
      };

      const results = await fetch(
        `${process.env.PARAGON_URL}/sdk/proxy/slack/${endpoint}?${new URLSearchParams(req.query)}`,
        fetchOps,
      );

      const response = await results.json();

      return response;
    } catch (error) {
      return {
        error: error,
      };
    }
  }
  
}
