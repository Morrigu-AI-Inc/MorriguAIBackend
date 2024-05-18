import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RawmaterialService } from './rawmaterial.service';
import { CreateRawmaterialDto } from './dto/create-rawmaterial.dto';
import { UpdateRawmaterialDto } from './dto/update-rawmaterial.dto';

@Controller('rawmaterial')
export class RawmaterialController {
  constructor(private readonly rawmaterialService: RawmaterialService) {}

  @Post()
  create(@Body() createRawmaterialDto: CreateRawmaterialDto) {
    return this.rawmaterialService.create(createRawmaterialDto);
  }

  @Get()
  findAll() {
    return this.rawmaterialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rawmaterialService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRawmaterialDto: UpdateRawmaterialDto,
  ) {
    return this.rawmaterialService.update(id, updateRawmaterialDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rawmaterialService.remove(id);
  }
}
