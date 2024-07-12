import { Injectable } from '@nestjs/common';
import { CreateNotepadDto } from './dto/create-notepad.dto';
import { UpdateNotepadDto } from './dto/update-notepad.dto';
import { Notepad } from './entities/notepad.entity';
import { ToolsService } from '../tools.service';

@Injectable()
export class NotepadService {
  constructor(public toolsService: ToolsService) {
    const tool = new Notepad().toJsonTool();
    toolsService.updateTool(tool as any);
  }
  create(createNotepadDto: CreateNotepadDto) {
    return 'This action adds a new notepad';
  }

  findAll() {
    return `This action returns all notepad`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notepad`;
  }

  update(id: number, updateNotepadDto: UpdateNotepadDto) {
    return `This action updates a #${id} notepad`;
  }

  remove(id: number) {
    return `This action removes a #${id} notepad`;
  }
}
