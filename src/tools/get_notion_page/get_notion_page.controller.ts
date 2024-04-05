import { Controller, Get, Query, Req } from '@nestjs/common';
import * as yup from 'yup';

@Controller('tools/get_notion_page')
export class GetNotionPageController {
  @Get()
  async getNotionPage(
    @Query('parameters') parameters: string,
    @Req() req,
  ): Promise<any> {
    try {
      const validPayload = JSON.parse(parameters);

      const validation = yup.object().shape({
        page_id: yup.string().required(),
      });

      const validatedVals = validation.validateSync(validPayload, {
        abortEarly: false,
        stripUnknown: true,
      });

      const results = await fetch(
        `${process.env.PARAGON_URL}/sdk/proxy/notion/v1/pages/${validatedVals.page_id}`,
        {
          method: 'GET',
          headers: {
            Authorization: req.headers.authorization,
            'Content-Type': 'application/json',
          },
        },
      ).then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Accumulate the chunks into a single Uint8Array
        const reader = response.body.getReader();
        const chunks = [];

        return reader.read().then(function processText({ done, value }) {
          if (done) {
            // Convert the accumulated chunks into a single Uint8Array
            const concatenated = new Uint8Array(
              chunks.reduce((acc, array) => acc.concat(Array.from(array)), []),
            );
            // Decode and parse the Uint8Array into a string, then into JSON
            return new TextDecoder().decode(concatenated);
          }

          chunks.push(value);

          return reader.read().then(processText);
        });
      });

      const jsonResults = {
        ...JSON.parse(results).output,
      };

      jsonResults.id = jsonResults.id.replace(/-/g, '');

      return {
        result: {
          tool_name: 'get_notion_page',
          stdout: jsonResults,
        },
      };
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return {
          result: {
            tool_name: 'get_notion_page',
            stdout: {
              message:
                'You have succesfully authenticated with Notion. However, there was an error fetching the page.',
              data: error.errors,
            },
          },
        };
      }
      return {
        result: {
          tool_name: 'get_notion_page',
          stdout: {
            message:
              'You have succesfully authenticated with Notion. However, there was an error fetching the page.',
            data: error,
          },
        },
      };
    }
  }
}
