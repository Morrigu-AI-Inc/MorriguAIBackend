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
  async findAll(@Query() query) {
    const { limit = 10, page = 1 } = query;

    const resp = await this.fsisService.listPageinated({
      limit: parseInt(limit, 10),
      page: parseInt(page, 10),
    });

    // console.log('resp', resp);

    // console.log('data', data);

    return {
      data: resp,
      limit: parseInt(limit, 10),
      page: parseInt(page, 10),
      count: resp.length,
    };
  }

  @Get('address')
  searchByAddress(
    @Query() searchAddressDto: { street: string; city: string; state: string },
  ) {
    const { street, city, state } = searchAddressDto;
    return this.fsisService.searchByAddress({
      street,
      city,
      state,
    });
  }

  @Get('injest')
  injest() {
    return this.fsisService.ingest();
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
