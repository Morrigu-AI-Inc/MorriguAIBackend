import { Controller, Get, Query, Req } from '@nestjs/common';
import * as yup from 'yup';

@Controller('tools/search_notion')
export class SearchNotionController {
  @Get()
  async searchNotion(
    @Query('parameters') parameters: string,
    @Req() req,
  ): Promise<any> {
    try {
      const validPayload = JSON.parse(parameters);

      const validation = yup.object().shape({
        query: yup.string().required(),
        sort: yup
          .object()
          .shape({
            direction: yup.string().oneOf(['ascending', 'descending']),

            timestamp: yup.string().oneOf(['last_edited_time']),
          })
          .default(undefined),

        filter: yup
          .object()
          .shape({
            value: yup.string(),
            property: yup.string(),
          })
          .default(undefined),

        start_cursor: yup.string(),
        page_size: yup.number(),
      });

      const validatedVals = validation.validateSync(validPayload, {
        abortEarly: false,
        stripUnknown: true,
      });

      const results = await fetch(
        `${process.env.PARAGON_URL}/sdk/proxy/notion/v1/search`,
        {
          method: 'POST',
          headers: {
            Authorization: req.headers.authorization,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(validatedVals),
        },
      );

      const jsonResults = await results.json();

      return {
        result: {
          tool_name: 'search_notion',
          stdout:
            jsonResults.output.results.length > 0
              ? jsonResults.output.results
              : `No results found for query: ${validatedVals.query}`,
        },
      };
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return {
          result: {
            tool_name: 'search_notion',
            stdout: {
              message: 'Error fetching notion.',
              data: error.errors,
            },
          },
        };
      }
      return {
        result: {
          tool_name: 'search_notion',
          stdout: {
            message: 'Error fetching notion.',
            data: error,
          },
        },
      };
    }
  }
}
