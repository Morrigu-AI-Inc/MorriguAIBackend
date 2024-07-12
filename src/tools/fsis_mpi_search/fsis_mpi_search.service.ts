import { Injectable } from '@nestjs/common';
import { CreateFsisMpiSearchDto } from './dto/create-fsis_mpi_search.dto';
import { UpdateFsisMpiSearchDto } from './dto/update-fsis_mpi_search.dto';
import { ToolsService } from '../tools.service';
import { FsisMpiSearchTool } from './entities/fsis_mpi_search.entity';

@Injectable()
export class FsisMpiSearchService {
  constructor(private readonly toolsService: ToolsService) {
    const tool = new FsisMpiSearchTool().toJsonTool();
    toolsService.updateTool(tool as any);
  }
  create(createFsisMpiSearchDto: CreateFsisMpiSearchDto) {
    return 'This action adds a new fsisMpiSearch';
  }

  findAll() {
    return `This action returns all fsisMpiSearch`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fsisMpiSearch`;
  }

  update(id: number, updateFsisMpiSearchDto: UpdateFsisMpiSearchDto) {
    return `This action updates a #${id} fsisMpiSearch`;
  }

  remove(id: number) {
    return `This action removes a #${id} fsisMpiSearch`;
  }
}
