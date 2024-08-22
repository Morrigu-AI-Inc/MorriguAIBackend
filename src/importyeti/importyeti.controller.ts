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


  @Get('marinetraffic')
  async getMarineTraffic() {
    return this.importyetiService.getShipmentDetails();
  }

  @Get('station')
  async station() {
    return this.importyetiService.station();
  }
}
