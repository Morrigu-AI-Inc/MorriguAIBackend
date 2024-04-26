import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Get,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ToolDocument } from 'src/db/schemas/Tools';
import * as yup from 'yup';
import { Model } from 'mongoose';

import * as quickbooks_api_integration from '../tool_json/compiled_taps/quickbooks_api_integrations.json';
import * as github_api_integration from '../tool_json/compiled_taps/github_api_integration.json';
import * as salesforce_api_integration from '../tool_json/compiled_taps/salesforce_api_integration.json';
import * as web_search from '../tool_json/compiled_taps/web_search.json';

const tools = [
  quickbooks_api_integration,
  github_api_integration,
  salesforce_api_integration,
  web_search,
];

const validation = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().required(),
  input_schema: yup
    .object()
    .shape({
      type: yup.string().required(),
      properties: yup.lazy((obj) =>
        yup.object().shape(
          Object.keys(obj).reduce((shape, key) => {
            // Default validation for any property under 'properties'
            shape[key] = yup
              .object()
              .shape({
                type: yup.string().required(),
                description: yup.string(),
                enum: yup.array().of(yup.string()), // Optional, only used if 'enum' is present
              })
              .noUnknown(true); // Ensures only the specified fields are included

            return shape;
          }, {}),
        ),
      ),
      required: yup.array().of(yup.string()).required(), // Validates the 'required' array of property names
    })
    .required(),
});

@Controller('tools')
export class ToolsController {
  private tools: {
    name: string;
    description: string;
    input_schema: any;
  }[] = tools;
  constructor(
    @InjectModel('ToolDescription')
    private readonly toolModel: Model<ToolDocument>,
  ) {}

  @Get()
  async findAll(): Promise<Partial<ToolDocument>[]> {
    // Logic to fetch all tools
    return this.toolModel.find();
  }

  @Post()
  async create(
    @Body() tool: Partial<ToolDocument>,
  ): Promise<Partial<ToolDocument>> {
    validation.validateSync(tool, {
      abortEarly: true,
    });

    const newTool = await this.toolModel.create(tool);

    // Logic to create a new tool
    return newTool;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() tool: any,
  ): Promise<Partial<ToolDocument>> {
    // Logic to update a specific tool by ID

    validation.validateSync(tool, {
      abortEarly: true,
    });

    const updatedTool = this.toolModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          ...tool,
        },

        new: true,
      },
    );

    return updatedTool as any;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    // Logic to delete a specific tool by ID
    return this.toolModel.deleteOne({
      _id: id,
    });
  }

  @Get('/updateAll')
  async bulkUpdate(): Promise<any> {
    try {
      for (const tool of tools) {
        const validTools = validation.validateSync(tool, {
          abortEarly: true,
        });

        await this.toolModel.updateOne(
          {
            name: validTools.name,
          },
          {
            $set: {
              ...tool,
            },
          },
        );
      }

      return {
        message: 'Bulk update successful',
      };
    } catch (error) {
      if (error instanceof yup.ValidationError)
        return {
          error: error.errors,
        };
      return error;
    }
    // Logic to bulk create tools
  }
}
