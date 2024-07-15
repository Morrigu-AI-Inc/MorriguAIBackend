import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsdaDataService } from './usda_data.service';
import { CreateUsdaDatumDto } from './dto/create-usda_datum.dto';
import { UpdateUsdaDatumDto } from './dto/update-usda_datum.dto';

@Controller('usda-data')
export class UsdaDataController {
  constructor(private readonly usdaDataService: UsdaDataService) {}

  @Get('scrape')
  scrape() {
    return this.usdaDataService.scrapeUsdaData();
  }
}
