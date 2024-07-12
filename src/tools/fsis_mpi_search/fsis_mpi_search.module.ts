import { Module } from '@nestjs/common';
import { FsisMpiSearchService } from './fsis_mpi_search.service';
import { FsisMpiSearchController } from './fsis_mpi_search.controller';
import { DbModule } from 'src/db/db.module';
import { FsisService } from 'src/fsis/fsis.service';
import { ToolsService } from '../tools.service';

@Module({
  controllers: [FsisMpiSearchController],
  providers: [FsisMpiSearchService, FsisService, ToolsService],
  imports: [DbModule]
})
export class FsisMpiSearchModule {}
