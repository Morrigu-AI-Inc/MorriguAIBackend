import { Controller, Get, Query, Req } from '@nestjs/common';
import * as yup from 'yup';

@Controller('tools/get_notion_page_property')
export class GetNotionPagePropertyController {
  @Get()
  async getNotionPageProperty(
    @Query('parameters') parameters: string,
    @Req() req,
  ): Promise<any> {
    const validPayload = JSON.parse(parameters);

    const validations = yup.object().shape({
      page_id: yup.string().required(),
      property_id: yup.string().required(),
    });

    try {
      const validatedVals = validations.validateSync(validPayload, {
        abortEarly: false,
        stripUnknown: true,
      });

      const results = await fetch(
        `${process.env.PARAGON_URL}/sdk/proxy/notion/v1/pages/${validatedVals.page_id}/properties/${validatedVals.property_id}`,
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
          tool_name: 'get_notion_page_property',
          stdout: jsonResults.output,
        },
      };
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return {
          result: {
            tool_name: 'get_notion_page_property',
            stdout: {
              message:
                'Authenticated with Notion successfully. However, there was an error during the validation process.',
              data: error.errors,
            },
          },
        };
      }
      return {
        result: {
          tool_name: 'get_notion_page_property',
          stdout: {
            message: 'Error fetching Notion page property.',
            data: error,
          },
        },
      };
    }
  }
}
