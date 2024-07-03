import { Controller, Get, Query, Req } from '@nestjs/common';

@Controller('tools/quickbooks_api_integration')
export class QuickbooksApiIntegrationController {
  constructor() {}

  @Get()
  async getQuickbooksApiIntegration(
    @Req() req: any,
    @Query('endpoint') endpoint: string,
    @Query('method') method: string,
  ) {
    try {
      console.log('Quickbooks API Integration', req.query);
      console.log('Quickbooks API Integration', method);
      console.log('Quickbooks API Integration', endpoint);

      const fetchOps = {
        method: req.method,
        headers: {
          Authorization: req.headers.authorization.includes('Bearer')
            ? req.headers.authorization
            : `Bearer ${req.headers.authorization}`,
          'Content-Type': 'application/json; charset=utf-8',
        },
      };
      const { endpoint: _ep, ...queryParameters } = req.query;

      console.log(
        'Valid Payload',
        `${process.env.PARAGON_URL}/sdk/proxy/quickbooks${endpoint}?${new URLSearchParams(
          {
            ...queryParameters,
            minorVersion: 70,
          },
        ).toString()}`,
      );

      const results = await fetch(
        `${process.env.PARAGON_URL}/sdk/proxy/quickbooks${endpoint}?${new URLSearchParams(
          {
            ...queryParameters,
            minorVersion: 70,
          },
        ).toString()}`,
        fetchOps,
      );

      const response = await results.json();

      return response;
    } catch (error) {
      console.error('Error getting Quickbooks Api Integration', error);
    }
  }
}
