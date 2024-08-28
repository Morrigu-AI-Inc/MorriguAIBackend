import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AisService } from './ais.service';
import { CreateAiDto } from './dto/create-ai.dto';
import { UpdateAiDto } from './dto/update-ai.dto';

@Controller('ais')
export class AisController {
  constructor(private readonly aisService: AisService) {}

  @Get('/vessels/bounds/:minLat/:maxLat/:minLon/:maxLon')
  getVesselsInBounds(
    @Param('minLat') minLat: string,
    @Param('maxLat') maxLat: string,
    @Param('minLon') minLon: string,
    @Param('maxLon') maxLon: string,
  ) {
    try {
      return this.aisService.getVesselsByBoundingBox({
        X1: parseFloat(minLon),
        X2: parseFloat(maxLon),
        Y1: parseFloat(minLat),
        Y2: parseFloat(maxLat),
      });
    } catch (error) {
      return error;
    }
  }

  @Get('/vessels/:mmsi')
  getVesselByMmsi(@Param('mmsi') mmsi: string) {
    try {
      return this.aisService.scrapeVesselFinderByMMSI(parseInt(mmsi));
      // return this.aisService.getVesselByMMSI(parseInt(mmsi));
    } catch (error) {
      return error;
    }
  }

  @Get('/vessels/commodities/:hscode')
  getVesselsByCommodity(@Param('hscode') hscode: string) {
    try {
      return this.aisService.getTopVessels(hscode);
    } catch (error) {
      return error;
    }
  }
}
