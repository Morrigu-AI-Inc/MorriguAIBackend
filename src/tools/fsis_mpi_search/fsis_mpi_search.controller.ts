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

  @Get()
  searchByAddress(@Query() query) {
    console.log('query', query);
    return this.fisService.searchByAddress(query);
  }
}



