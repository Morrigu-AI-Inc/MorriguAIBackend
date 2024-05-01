// src/financial-plan/operating-model.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { OperatingModelService } from './operating-model.service';

@Controller('operating-models')
export class OperatingModelController {
  constructor(private readonly operatingModelService: OperatingModelService) {}

  @Post('init')
  async initializeOperatingModel() {
    return this.operatingModelService.initializeOperatingModel();
  }

  @Post()
  async createOperatingModel(@Body() createOperatingModelData: any) {
    return this.operatingModelService.createOperatingModel(
      createOperatingModelData,
    );
  }

  @Get(':id')
  async getOperatingModel(@Param('id') id: string) {
    return this.operatingModelService.getOperatingModel(id);
  }

  @Put(':id')
  async updateOperatingModel(@Param('id') id: string, @Body() updateData: any) {
    return this.operatingModelService.updateOperatingModel(id, updateData);
  }

  @Delete(':id')
  async deleteOperatingModel(@Param('id') id: string) {
    await this.operatingModelService.deleteOperatingModel(id);
  }

  @Get(':id/forecast')
  async forecast(
    @Param('id') id: string,
    @Query('monthsAhead') monthsAhead: number,
    @Query('growthRate') growthRate: number,
  ) {
    return this.operatingModelService.calculateForecasts(
      id,
      monthsAhead,
      growthRate,
    );
  }
}
