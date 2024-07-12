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
import { FsisMpiSearchService } from './fsis_mpi_search.service';
import { CreateFsisMpiSearchDto } from './dto/create-fsis_mpi_search.dto';
import { UpdateFsisMpiSearchDto } from './dto/update-fsis_mpi_search.dto';
import { FsisService } from 'src/fsis/fsis.service';

@Controller('tools/fsis_mpi_search')
export class FsisMpiSearchController {
  constructor(
    private readonly fsisMpiSearchService: FsisMpiSearchService,
    private readonly fisService: FsisService,
  ) {}

  @Post()
  create(@Body() createFsisMpiSearchDto: CreateFsisMpiSearchDto) {
    return this.fsisMpiSearchService.create(createFsisMpiSearchDto);
  }

  @Get()
  findAll(@Query() query) {
    console.log('query', query);
    return this.fisService.searchByAddress(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fsisMpiSearchService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFsisMpiSearchDto: UpdateFsisMpiSearchDto,
  ) {
    return this.fsisMpiSearchService.update(+id, updateFsisMpiSearchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fsisMpiSearchService.remove(+id);
  }
}
