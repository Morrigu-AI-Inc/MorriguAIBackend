import { Controller, Get, Query, Req } from '@nestjs/common';

@Controller('tools/pandadoc_get_document_sections')
export class PandadocGetDocumentSectionsController {
  @Get()
  async getPandadocDocumentSections(
    @Query('parameters') parameters: string,
    @Req() req,
  ): Promise<any> {
    const validPayload = JSON.parse(parameters);

    if (!validPayload.id) {
      return {
        result: {
          tool_name: 'pandadoc_get_document_sections',
          stdout: {
            message: 'Missing required parameter: id',
          },
        },
      };
    }

    try {
      const results = await fetch(
        `${process.env.PARAGON_URL}/sdk/proxy/pandadoc/documents/${validPayload.id}/sections`,
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
          tool_name: 'pandadoc_get_document_sections',
          stdout: output,
        },
      };
    } catch (error) {
      return {
        result: {
          tool_name: 'pandadoc_get_document_sections',
          stdout: {
            message: 'Error fetching Pandadoc document sections.',
            data: error,
          },
        },
      };
    }
  }
}
