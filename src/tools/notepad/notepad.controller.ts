import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Headers,
} from '@nestjs/common';
import { NotepadService } from './notepad.service';
import { CreateNotepadDto } from './dto/create-notepad.dto';
import { UpdateNotepadDto } from './dto/update-notepad.dto';

@Controller('tools/notepad')
export class NotepadController {
  constructor(private readonly notepadService: NotepadService) {}

  @Post()
  async create(@Body() req, @Headers() headers, @Query() queryParameters) {
    // create(@Body() createNotepadDto: CreateNotepadDto) {
    console.log('create notepad');
    console.log(req);
    console.log(headers);
    console.log(queryParameters);
    
    return req;
  }

  @Get()
  findAll() {
    return this.notepadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notepadService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNotepadDto: UpdateNotepadDto) {
    return this.notepadService.update(+id, updateNotepadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notepadService.remove(+id);
  }
}
