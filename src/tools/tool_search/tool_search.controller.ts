import { Controller, Get, Query, Req } from '@nestjs/common';
import slack_api_integration from 'src/tool_json/backend/slack_api_integration';
import { ToolsService } from '../tools.service';

// parameters: {
//       $schema: 'http://json-schema.org/draft-07/schema#',
//       title: 'Invoke Tool',
//       description: 'Invoke a tool by its name',
//       type: 'object',
//       properties: {
//         tool_name: {
//           type: 'string',
//           description: 'Name of the tool to invoke',
//         },
//         payload: {
//           endpoint: {
//             type: 'string',
//             description: 'API endpoint for the request',
//             value: '/api/tools/invoke_tool/:tool_name',
//           },
//           method: {
//             // this is to be filled in with the method schema
//             type: 'string',
//             enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//             description: 'HTTP method used for the request',
//           },
//           contentType: {
//             // this is to be filled in with the content type schema
//             type: 'string',
//             enum: ['application/x-www-form-urlencoded', 'application/json'],
//             description: 'Content type of the request body',
//           },
//           queryParameters: {
//             // this is to be filled in with the query parameters schema
//             type: 'object',
//             properties: {
//               name: {
//                 type: 'string',
//                 description: 'Name of the tool to invoke',
//               },
//             },
//             required: ['name'],
//           },
//           body: {
//             type: 'object',
//             description: 'Payload to send to the tool',
//           },
//         },
//       },
//       required: ['endpoint', 'method', 'queryParameters'],
//       additionalProperties: false, // do not add any additional properties
//     },

type AIRequestPayload = {
  endpoint: string;
  method: string;
  contentType: string;
  queryParameters: {
    [key: string]: string;
  };
  body: {
    [key: string]: any;
  };
  pathParameters: {
    [key: string]: string;
  };
};

@Controller('tools')
export class ToolSearchController {
  constructor(private readonly toolService: ToolsService) {}

  @Get('tool_search')
  async search(@Query('payload') payload: string): Promise<any> {
    console.log('Searching for tools', payload);
    const validPayload = JSON.parse(JSON.parse(payload));

    const tools = await this.toolService.searchToolsV2(validPayload.search);

    console.log(tools);

    // const tools = await this.toolService.searchToolsV2(
    //   snapshot.content[0].text,
    // );

    return {
      message: 'Search successful',
      data: {
        tools: [
          ...tools.map((tool) => {
            return {
              name: tool.name,
              description: tool.description,
              properties: tool.input_schema,
            };
          }),
          // {
          //   name: slack_api_integration.function.name,
          //   description: slack_api_integration.function.description,
          //   properties: slack_api_integration.function.parameters.properties,
          // },
        ],
      },
    };
  }

  @Get('invoke_tool')
  async invokeTool(
    @Query('payload') payload: string,
    @Req() req: any,
  ): Promise<any> {
    try {
      const {
        tool_name,
        payload: validPayload,
      }: {
        tool_name: string;
        payload: AIRequestPayload;
      } = JSON.parse(JSON.parse(payload));

      const {
        endpoint,
        method,
        contentType,
        body,
        queryParameters,
        pathParameters,
      } = validPayload;

      if (!validPayload.queryParameters) {
        validPayload.queryParameters = {};
      }

      if (!validPayload.body) {
        validPayload.body = {};
      }

      for (const key in pathParameters) {
        validPayload.endpoint = validPayload.endpoint.replace(
          `{${key}}`,
          pathParameters[key],
        );
      }

      console.log('Endpoint: ', validPayload.endpoint);

      const endPoint = `${process.env.FUNCTION_CALLS_URL}/api/${tool_name}?${new URLSearchParams(
        {
          endpoint: validPayload.endpoint,
          ...validPayload.queryParameters,
        },
      ).toString()}`;

      const fetchOps = {
        method: validPayload.method,
        headers: {
          'Content-Type': validPayload.contentType,
          Authorization: req.headers.authorization.includes('Bearer')
            ? req.headers.authorization
            : `Bearer ${req.headers.authorization}`,
        },
        body: validPayload.body ? JSON.stringify(validPayload.body) : null,
      };

      if (validPayload.method === 'GET') {
        delete fetchOps.body;
      }

      const call = await fetch(endPoint, fetchOps);

      const json = await call.json();

      console.log(json);

      return {
        message: `Successfully invoked tool ${tool_name}`,
        name: tool_name,
        payload: validPayload,
        response: json,
      };
    } catch (error) {
      console.error(error);
      return {
        message: 'Error invoking tool',
        data: {
          error,
        },
      };
    }
  }
}
