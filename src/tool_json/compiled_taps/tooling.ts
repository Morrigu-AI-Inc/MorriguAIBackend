const tool_search = {
  type: 'function',
  function: {
    name: 'tool_search',
    description: `
    Use this tool to find a tool by its name or description.
    Enter a search term to find a tool.

    Available Types of Tools:
    - QuickBooks Integration
    - Slack API Integration
    - Notion API Integration
    - HubSpot API Integration
    - Display Chart

     Find a tool by its name or description.
    
     Fine a tool with a query term to search for a tool. The query term describes what you are looking for in a tool.
     Once you have identified a VALID tool you can use the tool to complete a task.

     invoke_tool is used to invoke a tool by its name. You must search for the tool first before invoking it.

    `,
    parameters: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      properties: {
        search: {
          type: 'string',
          description: 'Search term to find a tool',
        },
      },
      required: ['search'],
      additionalProperties: false, // do not add any additional properties
    },
  },
};

const invoke_tool = {
  type: 'function',
  function: {
    name: 'invoke_tool',
    description: `
    Use this tool to invoke a tool by its name.
    Enter the name of the tool to invoke it.
    `,
    parameters: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'Invoke Tool',
      description:
        'Invoke a tool by its name. Do not use made up tools as the tool will fail. You must search for the tools.',
      type: 'object',
      properties: {
        tool_name: {
          type: 'string',
          description:
            'Name of the tool to invoke this always starts with tools/ and the name of the tool. Do not try to make up tools it will fail',
        },
        payload: {
          type: 'object',
          description: 'Payload to send to the tool',
          oneOf: [
            {
              type: 'object',
              description: 'Payload to send to the tool via query parameters',
              properties: {
                endpoint: {
                  type: 'string',
                  description: 'API endpoint for the request',
                  value: '/tools/:tool_name',
                },
                method: {
                  // this is to be filled in with the method schema
                  type: 'string',
                  enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
                  description: 'HTTP method used for the request',
                },
                contentType: {
                  // this is to be filled in with the content type schema
                  type: 'string',
                  enum: [
                    'application/x-www-form-urlencoded',
                    'application/json',
                  ],
                  description: 'Content type of the request body',
                },
                queryParameters: {
                  // this is to be filled in with the query parameters schema
                  type: 'object',
                  description: 'Query parameters to send to the tool',
                },
              },
              required: [
                'endpoint',
                'method',
                'contentType',
                'queryParameters',
              ],
            },
            {
              type: 'object',
              description: 'Payload to send to the tool via the request body',
              properties: {
                endpoint: {
                  type: 'string',
                  description: 'API endpoint for the request',
                  value: '/tools/:tool_name',
                },
                method: {
                  // this is to be filled in with the method schema
                  type: 'string',
                  enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
                  description: 'HTTP method used for the request',
                },
                contentType: {
                  // this is to be filled in with the content type schema
                  type: 'string',
                  enum: [
                    'application/x-www-form-urlencoded',
                    'application/json',
                  ],
                  description: 'Content type of the request body',
                },
                body: {
                  type: 'object',
                  description: 'Payload to send to the tool',
                },
              },
              required: ['endpoint', 'method', 'contentType', 'body'],
            },
            {
              type: 'object',
              description:
                'Payload to send to the tool via the request body and query parameters',
              properties: {
                endpoint: {
                  type: 'string',
                  description: 'API endpoint for the request',
                  value: '/tools/:tool_name',
                },
                method: {
                  // this is to be filled in with the method schema
                  type: 'string',
                  enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
                  description: 'HTTP method used for the request',
                },
                contentType: {
                  // this is to be filled in with the content type schema
                  type: 'string',
                  enum: [
                    'application/x-www-form-urlencoded',
                    'application/json',
                  ],
                  description: 'Content type of the request body',
                },
                body: {
                  type: 'object',
                  description: 'Payload to send to the tool',
                },
                queryParameters: {
                  // this is to be filled in with the query parameters schema
                  type: 'object',
                  description: 'Query parameters to send to the tool',
                },
              },
              required: [
                'endpoint',
                'method',
                'contentType',
                'body',
                'queryParameters',
              ],
            },
          ],

          additionalProperties: false, // do not add any additional properties
        },
      },
      required: ['tool_name', 'payload'],
      additionalProperties: false, // do not add any additional properties
    },
  },
};

export { tool_search, invoke_tool };
export default tool_search;
