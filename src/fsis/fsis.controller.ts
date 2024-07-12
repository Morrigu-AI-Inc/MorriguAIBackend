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
import { FsisService } from './fsis.service';
import { CreateFsiDto } from './dto/create-fsi.dto';
import { UpdateFsiDto } from './dto/update-fsi.dto';

@Controller('fsis')
export class FsisController {
  constructor(private readonly fsisService: FsisService) {}

  @Post()
  create(@Body() createFsiDto: CreateFsiDto) {
    return this.fsisService.create(createFsiDto);
  }

  @Get()
  findAll() {
    return this.fsisService.findAll();
  }

  @Get('address')
  searchByAddress(
    @Query() searchAddressDto: { street: string; city: string; state: string },
  ) {
    return this.fsisService.searchByAddress(searchAddressDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fsisService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFsiDto: UpdateFsiDto) {
    return this.fsisService.update(+id, updateFsiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fsisService.remove(+id);
  }
}
