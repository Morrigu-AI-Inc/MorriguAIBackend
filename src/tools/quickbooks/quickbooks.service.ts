import { Injectable } from '@nestjs/common';
import { CreateQuickbookDto } from './dto/create-quickbook.dto';
import { UpdateQuickbookDto } from './dto/update-quickbook.dto';
import { ToolsService } from '../tools.service';
import { QuickbookQueryTool } from './entities/quickbook.entity';

@Injectable()
export class QuickbooksService {
  constructor(public toolsService: ToolsService) {
    const tool = new QuickbookQueryTool().toJsonTool();
    toolsService.updateTool(tool as any);
  }
  create(createQuickbookDto: CreateQuickbookDto) {
    return 'This action adds a new quickbook';
  }

  findAll() {
    return `This action returns all quickbooks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quickbook`;
  }

  update(id: number, updateQuickbookDto: UpdateQuickbookDto) {
    return `This action updates a #${id} quickbook`;
  }

  remove(id: number) {
    return `This action removes a #${id} quickbook`;
  }
}
