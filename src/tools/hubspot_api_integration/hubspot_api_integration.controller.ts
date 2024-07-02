import { Controller, Get, Query, Req } from '@nestjs/common';

@Controller('tools/hubspot_api_integration')
export class HubspotApiIntegrationController {
  @Get()
  async getHubspotApiIntegration(
    @Query('payload') payload: string,
    @Req() req: any,
  ) {
    try {
      const validPayload = JSON.parse(JSON.parse(payload));

      delete validPayload?.body?.body?.token || null;

      const fetchOps = {
        method: validPayload.body?.method
          ? validPayload.body.method
          : validPayload?.method
            ? validPayload.method
            : 'GET',
        headers: {
          Authorization: req.headers.authorization.includes('Bearer')
            ? req.headers.authorization
            : `Bearer ${req.headers.authorization}`,
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: validPayload.body ? JSON.stringify(validPayload.body) : null,
      };

      if (validPayload.method !== 'POST') {
        delete fetchOps.body;
      }

      const results = await fetch(
        `${process.env.PARAGON_URL}/sdk/proxy/hubspot${validPayload?.endpoint}?${new URLSearchParams(validPayload.queryParameters)}`,
        fetchOps,
      );

      const response = await results.json();

      return response;
    } catch (error) {
      return {
        message: 'Failed to get Hubspot API integration',
        error: error.message,
      };
    }
  }
}
