// src/demand-generation/demand-generation.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { DemandGenerationService } from './demand-generation.service';

@Controller('demand-generation')
export class DemandGenerationController {
  constructor(
    private readonly demandGenerationService: DemandGenerationService,
  ) {}

  @Get('init')
  async initializeData() {
    return await this.demandGenerationService.initializeData();
  }

  @Post('create-lead')
  async createLead(@Body() createLeadData: any) {
    return await this.demandGenerationService.createLead(createLeadData);
  }

  @Post('convert-lead')
  async convertLead(@Body() convertLeadData: any) {
    const { leadId, lifetimeValue } = convertLeadData;
    return await this.demandGenerationService.convertLeadToCustomer(
      leadId,
      lifetimeValue,
    );
  }

  @Get('forecast')
  async getForecast(
    @Query('start') start: string,
    @Query('monthsAhead') monthsAhead: number,
  ) {
    const startDate = new Date(start);
    if (isNaN(startDate.getTime())) {
      throw new NotFoundException('Invalid start date');
    }
    return await this.demandGenerationService.forecastDemandGeneration(
      startDate,
      monthsAhead,
    );
  }

  @Get('leads')
  async getAllLeads() {
    return await this.demandGenerationService.getAllLeads();
  }

  @Get('customers')
  async getAllCustomers() {
    return await this.demandGenerationService.getAllCustomers();
  }
}
