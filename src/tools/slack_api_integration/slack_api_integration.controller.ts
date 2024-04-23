import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';

@Controller('tools/slack_api_integration')
export class SlackApiIntegrationController {
  @Post()
  async slackApiIntegrationPost(
    @Body() body,
    @Req() req,
    @Query('endpoint') endpoint: string,
  ) {
    try {
      console.log('Slack API Integration', body);
      console.log('Slack API Integration', req.query);

      const fetchOps = {
        method: req.method,
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
  async slackApiIntegration(@Query('payload') payload: any, @Req() req) {
    try {
      const validPayload = JSON.parse(JSON.parse(payload));
      console.log('Slack API Integration', payload);

      delete validPayload?.body?.body?.token || null;

      const fetchOps = {
        method: validPayload.body.method ? validPayload.body.method : 'GET',
        headers: {
          Authorization: req.headers.authorization.includes('Bearer')
            ? req.headers.authorization
            : `Bearer ${req.headers.authorization}`,
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: validPayload.body.body
          ? JSON.stringify(validPayload.body.body)
          : null,
      };

      if (validPayload.body.method !== 'POST') {
        delete fetchOps.body;
      }

      const results = await fetch(
        `${process.env.PARAGON_URL}/sdk/proxy/slack/${validPayload.endpoint}?${new URLSearchParams(validPayload.body.queryParameters)}`,
        fetchOps,
      );

      const response = await results.json();

      console.log('response', response);

      return response;
    } catch (error) {
      console.log('error', error);
      return {
        error: error,
      };
    }
  }
}
