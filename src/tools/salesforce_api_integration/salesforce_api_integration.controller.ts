import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';

@Controller('tools/salesforce_api_integration')
export class SalesforceApiIntegrationController {
  @Post()
  async salesforceApiIntegrationPost(
    @Body() body,
    @Req() req,
    @Query('endpoint') endpoint: string,
  ) {
    try {
      console.log('Salesforce API Integration', body);
      console.log('Salesforce API Integration', req.query);

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
        `${process.env.PARAGON_URL}/sdk/proxy/salesforce/${endpoint}`,
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
  async salesforceApiIntegration(
    @Query('endpoint') endpoint: any,
    @Req() req,
    @Query('queryParameters') queryParameters: any,
  ) {
    try {
      console.log('Salesforce API Integration', endpoint.queryParameters);
      console.log('Salesforce API Integration', req.query);

      const { query, path } = this.parseQuery(endpoint);

      const fetchOps = {
        method: req.method,
        headers: {
          Authorization: req.headers.authorization.includes('Bearer')
            ? req.headers.authorization
            : `Bearer ${req.headers.authorization}`,
          'Content-Type': 'application/json; charset=utf-8',
        },
      };

      const results = await fetch(
        `${process.env.PARAGON_URL}/sdk/proxy/salesforce/${path}?${new URLSearchParams(
          {
            ...query,
            ...req.query,
          },
        ).toString()}`,
        fetchOps,
      );

      const response = await results.json();

      return response.output;
    } catch (error) {
      return {
        error: error,
      };
    }
  }

  parseQuery(uri: string) {
    // Decode the entire URI
    let decodedUri = decodeURI(uri);

    // Replace '+' with a space to handle spaces encoded as '+'
    decodedUri = decodedUri.replace(/\+/g, ' ');

    // Split the URI into path and query string parts
    const [path, queryString] = decodedUri.split('?');

    // Split the query string into key-value pairs
    const queryPairs = queryString.split('&');
    const query: Record<string, string> = {};

    // Map each pair to an object property
    queryPairs.forEach((pair) => {
      const [key, value] = pair.split('=');
      query[key] = value;
    });

    // Return the path and query object
    return { path, query };
  }
}
