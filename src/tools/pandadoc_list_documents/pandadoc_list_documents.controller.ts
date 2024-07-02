import { Controller, Get, Query, Req } from '@nestjs/common';
import * as Yup from 'yup';

@Controller('tools/pandadoc_list_documents')
export class PandadocListDocumentsController {
  @Get()
  async pandadocListDocuments(
    @Req() req,
    @Query('parameters') parameters: string,
  ): Promise<any> {
    const validPayload = JSON.parse(parameters);

    

    let urlParams = new URLSearchParams();

    try {
      if (validPayload) {
        // sometimes the ai sends a newline character in place or an empty string

        const validation = Yup.object().shape({
          q: Yup.string().optional(),
          tag: Yup.string().optional(),
          status: Yup.number().integer().min(0).max(13).optional(),
          count: Yup.number().integer().min(1).max(100).optional(),
          page: Yup.number().integer().min(1).optional(),
          metadata: Yup.string().optional(),
          deleted: Yup.boolean().optional(),
          id: Yup.string().uuid().optional(),
          template_id: Yup.string().uuid().optional(),
          folder_uuid: Yup.string().uuid().optional(),
          form_id: Yup.string().uuid().optional(),
          order_by: Yup.string()
            .oneOf([
              'name',
              '-name',
              'date_created',
              '-date_created',
              'date_status_changed',
              '-date_status_changed',
              'date_of_last_action',
              '-date_of_last_action',
              'date_modified',
              '-date_modified',
              'date_sent',
              '-date_sent',
              'date_completed',
              '-date_completed',
              'date_expiration',
              '-date_expiration',
              'date_declined',
              '-date_declined',
              'status',
              '-status',
            ])
            .optional(),
          created_from: Yup.date().optional(),
          created_to: Yup.date().optional(),
          modified_from: Yup.date().optional(),
          modified_to: Yup.date().optional(),
          completed_from: Yup.date().optional(),
          completed_to: Yup.date().optional(),
          membership_id: Yup.string().optional(),
          contact_id: Yup.string().optional(),
        });

        const validatedVals = validation.validateSync(validPayload, {
          abortEarly: false,
          stripUnknown: true,
        });

        urlParams = new URLSearchParams(
          validatedVals as Record<string, string>,
        );
      }

      const results = await fetch(
        `${process.env.PARAGON_URL}/sdk/proxy/pandadoc/documents?${urlParams.toString()}`,
        {
          method: 'GET',
          headers: {
            Authorization: req.headers.authorization,
            'Content-Type': 'application/json',
          },
        },
      );

      const jsonResults = await results.json();

      return {
        result: {
          tool_name: 'pandadoc_list_documents',
          stdout: jsonResults.output,
        },
      };
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        return {
          result: {
            tool_name: 'pandadoc_list_documents',
            stdout: {
              message:
                'Validation errors fetching PandaDoc documents list. Re-enter the correct parameters.',
              data: error.errors,
            },
          },
        };
      }
      return {
        result: {
          tool_name: 'pandadoc_list_documents',
          stdout: {
            message: 'Error fetching PandaDoc documents list.',
            data: error,
          },
        },
      };
    }
  }
}
