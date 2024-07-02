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
  async getQuickbooksQuery(@Query('payload') payload: any, @Req() req) {
    try {
      const validPayload = JSON.parse(JSON.parse(payload));

      const { select, from, where, maxlimit = 100 } = validPayload;

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

      const results = await fetch(
        `${process.env.PARAGON_URL}/sdk/proxy/quickbooks/query?query=${query.trim()}&minorversion=70`,
        {
          method: 'GET',
          headers: {
            Authorization: req.headers.authorization.includes('Bearer')
              ? req.headers.authorization
              : `Bearer ${req.headers.authorization}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const output = await results.json();

      const json_xml = await parseStringPromise(output.output, {
        explicitArray: false,
        ignoreAttrs: true,
      });

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
            message: 'Error fetching QuickBooks data.' + error.message,
            data: 'Possible invalid QuickBooks query parameters. Ensure the Where clause is correct and does not use SQL functions. Ensure all integers have been cast to strings.',
          },
        },
      };
    }
  }
}
