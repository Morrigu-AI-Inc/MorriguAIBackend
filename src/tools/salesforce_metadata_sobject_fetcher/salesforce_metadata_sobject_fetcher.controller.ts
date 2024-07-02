import { Controller, Get, Query, Req } from '@nestjs/common';
import * as yup from 'yup';

@Controller('tools/salesforce_metadata_sobject_fetcher')
export class SalesforceMetadataSobjectFetcherController {
  constructor() {}

  @Get()
  async salesforceMetadataSobjectFetcher(
    @Req() req,
    @Query('sObject') sobj: string,
  ): Promise<any> {
    try {
      const sObjectMetadataFetcherSchema = yup.object({
        sObject: yup
          .string()
          .required('The name of the Salesforce object is required.')
          .matches(
            /^[a-zA-Z0-9_]+$/,
            'The object name must only contain letters, numbers, and underscores.',
          )
          .typeError('The object name must be a string.'),
      });

      const validatedVals = sObjectMetadataFetcherSchema.validateSync(
        {
          sObject: sobj,
        },
        {
          abortEarly: false,
          stripUnknown: true,
        },
      );

      

      const results = await fetch(
        `${process.env.PARAGON_URL}/sdk/proxy/salesforce/sobject/${sobj}`,
        {
          method: 'GET',
          headers: {
            Authorization: req.headers.authorization,
            'Content-Type': 'text/plain',
          },
          body: JSON.stringify(validatedVals),
        },
      );

      

      const jsonResults = await results.json();

      return jsonResults;
    } catch (error) {
      if (error.name === 'ValidationError') {
        return {
          result: {
            tool_name: 'salesforce_metadata_sobject_fetcher',
            stdout: {
              message: error.message,
              data: error.errors,
            },
          },
        };
      }
      return {
        result: {
          tool_name: 'salesforce_metadata_sobject_fetcher',
          stdout: {
            message: 'Error fetching Salesforce metadata sobject list.',
            data: error,
          },
        },
      };
    }
  }
}
