import { BaseTool } from 'src/tools/types';

export class BrandedFood {}

export class BrandedFoodTool extends BaseTool {
  public name = 'tools/branded_food';
  public description = `
    
  `;
  public input_schema = {
    type: 'object',
    properties: {
      endpoint: {
        type: 'string',
        description: 'API endpoint for the request',
        enum: ['/tools/branded_food'],
      },
      method: {
        type: 'string',
        enum: ['GET'],
        description: 'HTTP method used for the request',
        default: 'GET',
      },
      contentType: {
        type: 'string',
        enum: ['application/json'],
        description: 'Content type of the request body',
        default: 'application/json',
      },
      headers: {
        type: 'object',
        description: 'Headers to send to the tool',
        default: {},
      },
      queryParameters: {
        type: 'object',
        properties: {
          search: {
            type: 'string',
            description:
              'The search term to look for in the branded food database.',
          },
          limit: {
            type: 'number',
            description: 'The number of results to return per page.',
            default: 10,
          },
          page: {
            type: 'number',
            description: 'The page number to return.',
            default: 1,
          },
        },
        additionalProperties: false,
        required: ['limit', 'page'],
        oneOf: [{ required: ['search'] }],
      },
      body: {
        type: 'object',
        description: 'Payload to send to the tool',
        default: {},
        additionalProperties: false,
      },
    },
    required: [
      'endpoint',
      'method',
      'contentType',
      'headers',
      'queryParameters',
    ],
    additionalProperties: false,
  };
}
