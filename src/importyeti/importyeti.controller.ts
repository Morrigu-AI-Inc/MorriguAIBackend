import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ImportyetiService } from './importyeti.service';
import { CreateImportyetiDto } from './dto/create-importyeti.dto';
import { UpdateImportyetiDto } from './dto/update-importyeti.dto';

@Controller('importyeti')
export class ImportyetiController {
  constructor(private readonly importyetiService: ImportyetiService) {}

  @Get()
  async init() {
    return this.importyetiService.init();
  }

  @Get('merge-suppliers')
  async mergeShipment() {
    return this.importyetiService.mergeSuppliers();
  }

  @Get('marinetraffic')
  async getMarineTraffic() {
    return this.importyetiService.getShipmentDetails();
  }

  @Get('station')
  async station() {
    return this.importyetiService.station();
  }

  @Get('/top-ten-hscode/:month/:year')
  async getTopTenHscode(
    @Param('month') month: string,
    @Param('year') year: string,
  ) {
    return this.importyetiService.getTopTenTradedInMonth(month, year);
  }
}
