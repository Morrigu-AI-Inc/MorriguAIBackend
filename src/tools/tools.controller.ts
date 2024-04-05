import { Controller, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ToolDocument } from 'src/db/schemas/Tools';
import * as yup from 'yup';
import { Model } from 'mongoose';

const validation = yup.object().shape({
  tool_name: yup.string().required(),
  description: yup.string().required(),
  parameters: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required(),
        type: yup.string().required(),
        description: yup.string().required(),
      }),
    )
    .required(),
});

@Controller('tools')
export class ToolsController {
  constructor(
    @InjectModel('ToolDescription')
    private readonly toolModel: Model<ToolDocument>,
  ) {}

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

    const updatedTool = this.toolModel.findOneAndUpdate({ _id: id }, tool, {
      new: true,
    });

    return updatedTool;
  }

  @Delete(':id')
  remove(@Param('id') id: string): string {
    // Logic to delete a specific tool by ID
    return `Delete tool with ID ${id}`;
  }
}
