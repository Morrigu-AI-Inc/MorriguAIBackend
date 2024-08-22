import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NassService } from './nass.service';
import { CreateNassDto } from './dto/create-nass.dto';
import { UpdateNassDto } from './dto/update-nass.dto';

@Controller('nass')
export class NassController {
  constructor(private readonly nassService: NassService) {}

  @Post()
  create(@Body() createNassDto: CreateNassDto) {
    return this.nassService.create(createNassDto);
  }

  @Get()
  findAll() {
    return this.nassService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nassService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNassDto: UpdateNassDto) {
    return this.nassService.update(+id, updateNassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nassService.remove(+id);
  }
}
