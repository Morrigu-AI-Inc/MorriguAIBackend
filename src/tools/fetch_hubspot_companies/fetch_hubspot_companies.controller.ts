import { Controller, Get, Req } from '@nestjs/common';

@Controller('tools/fetch_hubspot_companies')
export class FetchHubspotCompaniesController {
  @Get()
  async fetchHubspotCompanies(@Req() req): Promise<any> {
    console.log('FETCH COMPANIES', req.headers);

    const results = await fetch(
      `${process.env.PARAGON_URL}/sdk/proxy/hubspot/crm/v3/objects/companies`,
      {
        method: 'GET',
        headers: {
          Authorization: req.headers.authorization,
          'Content-Type': 'application/json',
        },
      },
    );

    const jsonResults = await results.json();

    console.log('jsonResults', jsonResults.output);

    return {
      result: {
        tool_name: 'fetch_hubspot_companies',
        stdout: jsonResults.output,
      },
    };
  }
}
