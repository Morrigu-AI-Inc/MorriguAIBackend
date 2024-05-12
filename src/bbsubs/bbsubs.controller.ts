import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BbsubsService } from './bbsubs.service';
import { BBSubsDataPoint } from 'src/db/schemas/BBSubsDataPoint';

@Controller('bbsubs')
export class BbsubsController {
  constructor(private readonly bbsubsDataService: BbsubsService) {}

  @Get()
  async findAll(): Promise<BBSubsDataPoint[]> {
    return this.bbsubsDataService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BBSubsDataPoint> {
    return this.bbsubsDataService.findOne(id);
  }

  @Post()
  async create(
    @Body() bbsubsDataPoint: BBSubsDataPoint,
  ): Promise<BBSubsDataPoint> {
    return this.bbsubsDataService.create(bbsubsDataPoint);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<BBSubsDataPoint> {
    return this.bbsubsDataService.delete(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() bbsubsDataPoint: BBSubsDataPoint,
  ): Promise<BBSubsDataPoint> {
    return this.bbsubsDataService.update(id, bbsubsDataPoint);
  }
}
