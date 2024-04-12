import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { Xml2JsonServiceService } from 'src/xml2-json-service/xml2-json-service.service';

import { parseStringPromise } from 'xml2js';

@Controller('tools/quickbooks_query')
export class QuickbooksQueryController {
  constructor(private readonly xmlService: Xml2JsonServiceService) {}

  @Get()
  async getQuickbooksQuery(
    @Query('select_statement') select_statement: string,
    @Query('parameters') parameters: string,
    @Req() req,
  ) {
    try {
      const validPayload = JSON.parse(parameters);

      if (!validPayload.select_statement) {
        return {
          result: {
            tool_name: 'quickbooks_query',
            stdout: {
              message: 'Error in quickbooks_query params',
              data: 'select_statement is required',
            },
          },
        };
      }

      console.log(
        'select_statement',
        `${process.env.PARAGON_URL}/sdk/proxy/quickbooks/query?${new URLSearchParams(
          {
            query: validPayload.select_statement,
          },
        ).toString()}`,
      );

      const results = await fetch(
        `${process.env.PARAGON_URL}/sdk/proxy/quickbooks/query?${new URLSearchParams(
          {
            query: validPayload.select_statement,
          },
        ).toString()}`,
        {
          method: 'GET',
          headers: {
            Authorization: req.headers.authorization,
            'Content-Type': 'application/json',
          },
        },
      );

      const output = await results.json();

      const json_xml = await parseStringPromise(output.output, {
        explicitArray: false,
        ignoreAttrs: true,
      });

      console.log('output', json_xml);

      return {
        result: {
          tool_name: 'quickbooks_query',
          stdout: {
            message: 'Success',
            data: json_xml,
          },
        },
      };
    } catch (error) {
      console.log('error', error);
      return {
        result: {
          tool_name: 'quickbooks_query',
          stdout: {
            message: 'Error in quickbooks_query params: ' + select_statement,
            data: error,
          },
        },
      };
    }
  }
}
