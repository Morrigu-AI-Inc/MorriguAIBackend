const web_search = {
  name: 'web_search',
  description: 'Search the web any way you like.',
  input_schema: {
    type: 'object',
    properties: {
      endpoint: {
        type: 'string',
        enum: ['tools/web_search'],
      },
      method: {
        type: 'string',
        enum: ['GET'],
      },
      contentType: {
        type: 'string',
        enum: ['application/json'],
      },
      queryParameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The query to search for.',
          },
        },
        required: ['query'],
      },
    },
    required: ['endpoint', 'method', 'contentType', 'queryParameters'],
  },
};

export default web_search;
