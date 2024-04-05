import { Controller, Get, Req } from '@nestjs/common';

@Controller('tools/get_salesforce_objects_list')
export class GetSalesforceObjectsListController {
  @Get()
  async getSalesforceObjectsList(@Req() req): Promise<any> {
    try {
      const results = await fetch(
        `${process.env.PARAGON_URL}/sdk/proxy/salesforce/sobjects`,
        {
          method: 'GET',
          headers: {
            Authorization: req.headers.authorization,
            'Content-Type': 'application/json',
          },
        },
      );

      const jsonResults = await results.json();

      console.log('jsonResults', jsonResults);

      return {
        result: {
          tool_name: 'get_salesforce_objects_list',
          stdout: jsonResults,
        },
      };
    } catch (error) {
      return {
        result: {
          tool_name: 'get_salesforce_objects_list',
          stdout: {
            message: 'Error fetching Salesforce objects list.',
            data: error,
          },
        },
      };
    }
  }
}
