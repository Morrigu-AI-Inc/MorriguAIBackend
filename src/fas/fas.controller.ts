import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FasService } from './fas.service';
import { CreateFaDto } from './dto/create-fa.dto';
import { UpdateFaDto } from './dto/update-fa.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('fas')
export class FasController {
  constructor(private readonly fasService: FasService) {}

  @Post()
  create(@Body() createFaDto: CreateFaDto) {
    return this.fasService.create(createFaDto);
  }

  @Get()
  findAll() {
    return this.fasService.findAll();
  }

  @Get('settings')
  getSettings() {
    return this.fasService.getSettings();
  }

  @Get('countries')
  getFasCountries() {
    return this.fasService.getFasCountries();
  }

  @Get('countries/region')
  getFasCountriesGroupedByRegion() {
    return this.fasService.getFasCountriesGroupedByRegion();
  }

  @Get('countries/:countryCode')
  getFasCountryByCode(@Param('countryCode') countryCode: string) {
    return this.fasService.getFasCensusImportsByCountryCode({ countryCode });
  }

  @Get('commodities')
  getGatsCommodities() {
    return this.fasService.getGatsCommodities();
  }

  @Get('commodities/hs6')
  getGatsCommoditiesHs6() {
    return this.fasService.getGatsCommoditiesByhs6();
  }

  @Get('imports')
  getFasCensurImportsHistoryicalsJob() {
    console.log('fas imports');
    return this.fasService.findAll()
  }

  @Get('imports/:countryCode')
  getFasCensusImportsByCountryCode(@Param('countryCode') countryCode: string) {
    return this.fasService.getFasCensusImportsByCountryCode({ countryCode });
  }


  /// Cron Jobs

  @Cron(CronExpression.EVERY_WEEK)
  @Get('gats-census-imports')
  getFasCensusImportsAggr() {
    return this.fasService.getFasCensurImportsHistoryicalsJob();
  }

  @Cron(CronExpression.EVERY_WEEK)
  @Get('merge-gats-imports')
  mergeGatsImports() {
    return this.fasService.mergeGatsImports();
  }
}
