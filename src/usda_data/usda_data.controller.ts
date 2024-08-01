import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { USDA_REPORT_TYPES_ENUM, UsdaDataService } from './usda_data.service';
import { CreateUsdaDatumDto } from './dto/create-usda_datum.dto';
import { UpdateUsdaDatumDto } from './dto/update-usda_datum.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('usda-data')
export class UsdaDataController {
  constructor(private readonly usdaDataService: UsdaDataService) {}

  @Get()
  async getAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.usdaDataService.findAll(page, limit);
  }

  @Cron(CronExpression.EVERY_DAY_AT_1PM)
  @Get('scrape')
  async scrape() {
    await this.usdaDataService.scrapeUsdaData();

    return [];
  }

  @Get('analyze')
  async analyze(
    @Query('owner') owner: string,
    @Query('type')
    type: USDA_REPORT_TYPES_ENUM = USDA_REPORT_TYPES_ENUM.LIVESTOCK,
  ) {
    // await this.usdaDataService.scrapeUsdaData();

    const list = await this.usdaDataService.runAILogicOnUsdaReport(owner, type);
    return list;
  }

  @Get('/historicalGetSlaughterDataByState')
  async historicalGetSlaughterDataByState() {
    try {
      return await this.usdaDataService.historicalGetSlaughterDataByState();
    } catch (error) {
      return error;
    }
  }

  @Get('/:slug')
  async getOne(@Param('slug') slug: string) {
    return this.usdaDataService.findBySlug(slug);
  }
}
