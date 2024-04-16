import { Controller, Get, Query, Req } from '@nestjs/common';

@Controller('tools/quickbooks_update_create_delete')
export class QuickbooksUpdateController {
  @Get()
  async quickbooksUpdate(
    @Query('payload') payload: any,
    @Req() req: any,
    @Query('operation') operation2: any,
    @Query('entity') entity2: any,
    @Query('body') body2: any,
  ) {
    try {
      const {
        entity = entity2,
        operation = operation2,
        body = body2,
      } = JSON.parse(JSON.parse(payload));

      if (operation === 'create') {
        let parsedBody = undefined;

        switch (entity) {
          case 'budget':
            parsedBody = {
              Budget: body,
            };
            break;
          default:
            parsedBody = body;
            break;
        }

        console.log('Creating', entity + ' with body: ', parsedBody);
        console.log('Authorization', req.headers.authorization);

        const results = await fetch(
          `${process.env.PARAGON_URL}/sdk/proxy/quickbooks/${entity}`,
          {
            method: 'POST',
            headers: {
              Authorization: req.headers.authorization.includes('Bearer')
                ? req.headers.authorization
                : `Bearer ${req.headers.authorization}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(parsedBody),
          },
        );

        const json = await results.json();

        console.log('results', json);
        return json;
      }

      if (operation === 'update') {
        console.log('Updating', entity);
      }

      if (operation === 'delete') {
        console.log('Deleting', entity);
      }
      return {
        message: 'Operation not supported',
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }
}
