import { prop } from 'cheerio/lib/api/attributes';

const tool_search = {
  type: 'function',
  function: {
    name: 'tool_search',
    description: `
**Tool Search Guidelines**

1. **Use tool_search**: The tool_search function helps find tools by name or description within the dynamic, regularly updated elastic database hosted on MongoDB.
2. **How to Search**: Use relevant search terms like "financial analysis," "budget optimization," or "procurement insights" based on user queries.
3. **User Awareness**: Users aren't aware of the tool database; always perform searches internally without asking for uploads or additional information.
4. **Persistent Search**: If initial searches don't yield results, try different terms. All tools are accessible via tool_search and can be invoked using invoke_tool.
5. **Output Instructions**: Follow the OUTPUT_INSTRUCTIONS for each tool. For example, provide summaries or omit details as instructed. Respond clearly and concisely, adhering to these instructions.
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
      description: `
**Invoke Tool Guidelines**

1. **Identify and Execute**: Once you've found the appropriate tool and understand the instructions, use the invoke_tool function to execute it.
2. **Data Provision**: The invoke_tool function will provide the necessary data for your analysis or task.
3. **Follow Instructions**: Adhere to the tool's description and thoroughly analyze the provided data before responding.
4. **Real-Time Access**: Utilize tools that allow access to real-time databases to support your analysis.
5. **Visualization**: Use the display_chart tool to create charts and graphs for data visualization as needed.

**Important**: Review and adhere to the OUTPUT_INSTRUCTIONS provided by the tools. Respond clearly and concisely, summarizing the tool's results based on the data. Follow specific instructions, such as providing a summary or omitting details as required.
`,
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
                  enum: ['GET', 'DELETE'],
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
                  enum: ['POST', 'PUT'],
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
