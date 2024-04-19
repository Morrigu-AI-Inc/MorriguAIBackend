import { Controller, Get, Query, Req } from '@nestjs/common';
import { val } from 'cheerio/lib/api/attributes';

@Controller('tools/slack_api_integration')
export class SlackApiIntegrationController {
  @Get()
  async slackApiIntegration(@Query('payload') payload: any, @Req() req) {
    try {
      const validPayload = JSON.parse(JSON.parse(payload));

      //       {
      //   endpoint: 'conversations.history',
      //   body: {
      //     endpoint: 'conversations.history',
      //     method: 'POST',
      //     headers: {
      //       Authorization: 'Bearer xoxp-123456789012-123456789012-123456789012-abcd1234efgh5678'
      //     },
      //     body: { channel: 'C06UVAQ5VCN', text: 'hello dooode' }
      //   }
      // }

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
