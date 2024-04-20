import * as archive_a_page from '../taps/tap-notion/archive-a-page.json';

const all = [archive_a_page.properties];

const notion_api_integration = {
  type: 'function',
  function: {
    name: 'notion_api_integration',
    description: `
    This function allows you to interact with the Notion API.

    Special Notes: 
    
    You must always provide the endpoint to call on the Notion API.
    You must always provide the data to complete the operation with.
    
    `,
    parameters: {
      type: 'object',
      properties: {
        endpoint: {
          type: 'string',
          description: 'The endpoint to call on the Notion API.',
          enum: ['/v1/pages/{page_id}'],
        },
        body: {
          type: 'object',
          description: 'That data to complete the operation with.',
          oneOf: all,
        },
      },
      required: ['endpoint', 'body'],
    },
  },
};

export default notion_api_integration;
