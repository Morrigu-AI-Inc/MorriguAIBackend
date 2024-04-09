import { Controller, Req, Query, Get, Param } from '@nestjs/common';
import { Xml2JsonServiceService } from 'src/xml2-json-service/xml2-json-service.service';
import * as yup from 'yup';
import { parseStringPromise } from 'xml2js';

@Controller('tools/quickbooks_query_customers')
export class QuickbooksQueryCustomersController {
  constructor(private readonly xml2JsonService: Xml2JsonServiceService) {}

  @Get()
  async quickbooksQueryCustomers(
    @Req() req,
    @Query('parameters') parameters: string,
  ): Promise<any> {
    try {
      const validPayload = JSON.parse(parameters);

      const validation = yup.object().shape({
        select: yup.array().of(yup.string()).required(),
        where: yup
          .array()
          .of(
            yup.object().shape({
              field: yup.string().required(),
              operator: yup.string().required(),
              value: yup.string().required(),
            }),
          )
          .optional(),
        orderBy: yup.string().optional(),
        maxResults: yup.number().optional(),
      });

      const validatedVals = validation.validateSync(validPayload, {
        abortEarly: false,
        stripUnknown: true,
      });

      const sqlSelect = `SELECT * FROM Customer`; // we'll refine this later

      console.log('sqlStatement', sqlSelect);

      const results = await fetch(
        `${process.env.PARAGON_URL}/sdk/proxy/quickbooks/query?query=${sqlSelect}&minorversion=70`,
        {
          method: 'POST',
          headers: {
            Authorization: req.headers.authorization,
            'Content-Type': 'text/plain',
          },
          body: JSON.stringify(validatedVals),
        },
      );

      const jsonResults = await results.json();
      console.log('results', jsonResults);

      const result = await parseStringPromise(jsonResults.output, {
        explicitArray: false,
        ignoreAttrs: true,
        stripPrefix: true,
      });
      return {
        result: {
          tool_name: 'quickbooks_query_customers',
          stdout: (result.IntuitResponse.QueryResponse.Customer as any[]).slice(
            0,
            10,
          ),
        },
      };
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return {
          result: {
            tool_name: 'quickbooks_query_customers',
            stdout: {
              message:
                'Validation errors fetching QuickBooks customers list. Re-enter the correct parameters.',
              data: error.errors,
            },
          },
        };
      }
      return {
        result: {
          tool_name: 'quickbooks_query_customers',
          stdout: {
            message: 'Error fetching QuickBooks customers list.',
            data: error,
          },
        },
      };
    }
  }
}
