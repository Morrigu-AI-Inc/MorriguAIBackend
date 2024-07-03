import { Controller, Get, Query, Req } from '@nestjs/common';

@Controller('tools/pandadoc_get_document_status')
export class PandadocGetDocumentStatusController {
  @Get()
  async getPandadocDocumentStatus(
    @Query('parameters') parameters,
    @Req() req,
  ): Promise<any> {
    const validPayload = JSON.parse(parameters);

    if (!validPayload.id) {
      return {
        result: {
          tool_name: 'pandadoc_get_document_status',
          stdout: {
            message: 'Missing required parameter: id',
          },
        },
      };
    }

    try {
      const results = await fetch(
        `${process.env.PARAGON_URL}/sdk/proxy/pandadoc/documents/${validPayload.id}`,
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
          tool_name: 'pandadoc_get_document_status',
          stdout: jsonResults.output,
        },
      };
    } catch (error) {
      return {
        result: {
          tool_name: 'pandadoc_get_document_status',
          stdout: {
            message: 'Error fetching Pandadoc document status.',
            data: error,
          },
        },
      };
    }
  }
}
