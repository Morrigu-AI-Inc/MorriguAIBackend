import { Controller, Get, Query, Req } from '@nestjs/common';
import slack_api_integration from 'src/tool_json/backend/slack_api_integration';
import { ToolsService } from '../tools.service';


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

      const endPoint = `${process.env.BACKEND_API_URL}/api/${tool_name}?${new URLSearchParams(
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
