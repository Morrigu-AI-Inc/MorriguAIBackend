// src/revenue-model/revenue-model.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { RevenueModelService } from './revenue-model.service';
import { RevenueModel } from 'src/db/schemas/RevenueModel';

@Controller('revenue-models')
export class RevenueModelController {
  constructor(private readonly revenueModelService: RevenueModelService) {}

  @Post('init')
  @HttpCode(HttpStatus.CREATED)
  async initRevenueModel(): Promise<RevenueModel> {
    return this.revenueModelService.initRevenueModel();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createRevenueModel(@Body() createData: any): Promise<RevenueModel> {
    return this.revenueModelService.createRevenueModel(createData);
  }

  @Get(':id')
  async getRevenueModel(@Param('id') modelId: string): Promise<RevenueModel> {
    return this.revenueModelService.getRevenueModel(modelId);
  }

  @Put(':id')
  async updateRevenueModel(
    @Param('id') modelId: string,
    @Body() updateData: any,
  ): Promise<RevenueModel> {
    return this.revenueModelService.updateRevenueModel(modelId, updateData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRevenueModel(@Param('id') modelId: string): Promise<void> {
    return this.revenueModelService.deleteRevenueModel(modelId);
  }

  @Get(':scenario/forecasts')
  async calculateForecasts(
    @Param('scenario') scenario: string,
    @Query('startMonth') startMonth: string,
    @Query('monthsAhead') monthsAhead: number,
  ): Promise<any[]> {
    const startMonthDate = new Date(startMonth);
    return this.revenueModelService.calculateForecasts(
      scenario,
      startMonthDate,
      monthsAhead,
    );
  }
}
