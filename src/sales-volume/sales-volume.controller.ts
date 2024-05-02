// src/sales-forecast/sales-forecast.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SalesVolumeService } from './sales-volume.service';

@Controller('sales-volume')
export class SalesVolumeController {
  constructor(private readonly salesForecastService: SalesVolumeService) {}

  @Get('init')
  async initializeData(): Promise<void> {
    await this.salesForecastService.initializeData();
  }

  @Post()
  async createForecast(@Body() createForecastDto: any): Promise<any> {
    return await this.salesForecastService.createForecast(createForecastDto);
  }

  @Get(':id')
  async getForecastById(@Param('id') id: string): Promise<any> {
    return await this.salesForecastService.getForecastById(id);
  }

  @Put(':id')
  async updateForecast(
    @Param('id') id: string,
    @Body() updateForecastDto: any,
  ): Promise<any> {
    return await this.salesForecastService.updateForecast(
      id,
      updateForecastDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteForecast(@Param('id') id: string): Promise<void> {
    await this.salesForecastService.deleteForecast(id);
  }

  @Get()
  async getAllForecasts(): Promise<any[]> {
    return await this.salesForecastService.getAllForecasts();
  }

  @Post('forecast')
  async forecastSalesVolume(
    @Query('startDate') startDate: string,
    @Query('monthsAhead') monthsAhead: number,
    @Query('alpha') alpha: number,
  ): Promise<any[]> {
    const date = new Date(startDate);
    if (isNaN(date.getTime())) {
      throw new NotFoundException('Invalid start date provided');
    }
    return await this.salesForecastService.forecastSalesVolume(
      date,
      monthsAhead,
      alpha,
    );
  }

  @Post('forecast-revenue')
  async forecastRevenue(
    @Query('startDate') startDate: string,
    @Query('monthsAhead') monthsAhead: number,
    @Query('alpha') alpha: number,
    @Query('revenuePerUnit') revenuePerUnit: number,
  ): Promise<any[]> {
    const date = new Date(startDate);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid start date provided');
    }
    return await this.salesForecastService.forecastRevenue(
      date,
      monthsAhead,
      alpha,
      revenuePerUnit,
    );
  }
}
