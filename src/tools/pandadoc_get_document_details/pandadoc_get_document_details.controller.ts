import { Controller, Get, Query, Req } from '@nestjs/common';

@Controller('tools/pandadoc_get_document_details')
export class PandadocGetDocumentDetailsController {
  @Get()
  async getPandadocDocumentDetails(
    @Req() req,
    @Query('parameters') parameters,
  ): Promise<any> {
    const validPayload = JSON.parse(parameters);

    if (!validPayload.id) {
      return {
        result: {
          tool_name: 'pandadoc_get_document_details',
          stdout: {
            message: 'Missing required parameter: id',
          },
        },
      };
    }

    try {
      const results = await fetch(
        `${process.env.PARAGON_URL}/sdk/proxy/pandadoc/documents/${validPayload.id}/details`,
        {
          method: 'GET',
          headers: {
            Authorization: req.headers.authorization,
            'Content-Type': 'application/json',
          },
        },
      );

      const { output } = await results.json();

      return {
        result: {
          tool_name: 'pandadoc_get_document_details',
          stdout: output,
        },
      };
    } catch (error) {
      return {
        result: {
          tool_name: 'pandadoc_get_document_details',
          stdout: {
            message: 'Error fetching Pandadoc document details.',
            data: error,
          },
        },
      };
    }
  }
}
