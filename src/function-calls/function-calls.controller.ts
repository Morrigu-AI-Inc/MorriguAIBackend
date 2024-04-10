import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ActionsService } from 'src/actions/actions.service';
import { FunctionCallsService } from './function-calls.service';
import { ToolsService } from 'src/tools/tools.service';
import { Xml2JsonServiceService } from 'src/xml2-json-service/xml2-json-service.service';

type InvokeTool = {
  tool_name: string;
  parameters: Record<string, any>;
};

@Controller('function-calls')
export class FunctionCallsController {
  private readonly logger = new Logger(FunctionCallsController.name);

  constructor(
    private readonly actionsService: ActionsService,
    private readonly functionService: FunctionCallsService,
    private readonly toolsService: ToolsService,
    private readonly xmlService: Xml2JsonServiceService,
  ) {}

  @Post()
  async invokeFunction(
    @Req() req,
    @Body()
    body: {
      type: string;
      id: string;
      name: string;
      input: Record<string, any>;
    },
  ): Promise<any> {
    console.log('Body', body);
    //     {
    //   type: 'tool_use',
    //   id: 'toolu_01LmbkSKYA6eMmhGPG12T8QG',
    //   name: 'search_notion',
    //   input: { query: 'hi' }
    // }
    // Simplified with async/await and error handling
    console.log(new URLSearchParams(body.input).toString());
    try {
      const response = await fetch(
        `${process.env.TOOLCHEST_URL}/${body.name.trim()}?parameters=${JSON.stringify(body.input)}&token=${req.headers.authorization}&${new URLSearchParams(body.input).toString()}`,
        {
          method: 'GET',
          headers: {
            Authorization: req.headers.authorization,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.json();

      return;
    } catch (error) {
      this.logger.error('Error getting function call', error);
      return {
        function_results: {
          error: 'Failed to process function calls',
          message: error.message,
        },
      };
    }
  }

  // Simplified Get method
  @Get('/:id')
  async getFunctionCall(
    @Param('id') id: string,
    @Query('parameters') parameters: string,
    @Req() req,
  ): Promise<any> {
    try {
      console.log('id', id);
      console.log('parameters', parameters);
      const result = await fetch(
        `${process.env.BACKEND_API_URL}/api/tools/${id}?parameters=${parameters}&(${new URLSearchParams(parameters).toString()})`,
        {
          method: 'GET',
          headers: {
            Authorization: req.headers.authorization,
            'Content-Type': 'application/json',
          },
        },
      );

      // console.log('result', await result.json());
      return await result.json();
    } catch (error) {
      this.logger.error('Error getting function call', error);
      return {
        function_results: {
          error: `Failed to get function call with ID ${id} and parameters ${parameters}`,
          message: error.message,
        },
      };
    }
  }
}
