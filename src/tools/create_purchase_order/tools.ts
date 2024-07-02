import { BaseTool } from '../types';

const search_suppliers: any = {
  name: 'tools/search_suppliers',
  description: 'Search for a supplier or a vendor by name.',
  input_schema: {
    type: 'object',
    oneOf: [
      {
        properties: {
          endpoint: {
            type: 'string',
            enum: ['tools/search_suppliers'],
          },
          method: {
            type: 'string',
            enum: ['GET'],
          },
          queryParameters: {
            type: 'object',
            properties: {
              search: {
                type: 'string',
              },
            },
            required: ['search'],
            additionalProperties: false,
          },
        },
        required: ['endpoint', 'method', 'queryParameters'],
      },
    ],
    required: ['endpoint', 'method'],
    defs: {
      search: {
        type: 'string',
        format: 'search',
      },
    },
  },
  features: [],
  use_cases: [],
  benefits: [],
  implementation: '',
  conclusion: '',
};
