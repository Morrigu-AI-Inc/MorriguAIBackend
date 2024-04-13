import {
  Controller,
  Get,
  Query,
  Req,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Xml2JsonServiceService } from 'src/xml2-json-service/xml2-json-service.service';
import { parseStringPromise } from 'xml2js';

@Controller('tools/quickbooks_query')
export class QuickbooksQueryController {
  constructor(private readonly xmlService: Xml2JsonServiceService) {}

  @Get()
  async getQuickbooksQuery(
    @Query('select') select: string,
    @Query('from') from: string,
    @Query('where') where: string,
    @Query('maxlimit') maxlimit: number = 5,
    @Req() req,
  ) {
    try {
      console.log('SQL Query Parameters', select, from, where, maxlimit);
      if (!select || !from) {
        throw new BadRequestException(
          'Both select and from parameters are required.',
        );
      }

      // Construct the QuickBooks SQL query
      let query = `SELECT ${select} FROM ${from}`;
      if (where) {
        query += ` WHERE ${where}`;
      }
      if (maxlimit) {
        query += ` MAXRESULTS ${maxlimit}`;
      }

      console.log('Constructed query', query);

      const results = await fetch(
        `${process.env.PARAGON_URL}/sdk/proxy/quickbooks/query?query=${query.trim()}&minorversion=70`,
        {
          method: 'GET',
          headers: {
            Authorization: req.headers.authorization,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!results.ok) {
        throw new NotFoundException('Failed to fetch data from QuickBooks.');
      }

      const output = await results.json();

      console.log('output', output);

      const json_xml = await parseStringPromise(output.output, {
        explicitArray: false,
        ignoreAttrs: true,
      });

      console.log('Formatted output', json_xml);

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

      return {
        result: {
          tool_name: 'quickbooks_query',
          stdout: {
            message: 'Error fetching QuickBooks data.',
            data: 'Possible invalid QuickBooks query parameters. Ensure the Where clause is correct and does not use SQL functions. Ensure all integers have been cast to strings.',
          },
        },
      };
    }
  }
}
