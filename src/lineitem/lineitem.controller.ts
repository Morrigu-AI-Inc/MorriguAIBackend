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
import { LineitemService } from './lineitem.service';
import { CreateLineitemDto } from './dto/create-lineitem.dto';
import { UpdateLineitemDto } from './dto/update-lineitem.dto';

@Controller('lineitem')
export class LineitemController {
  constructor(private readonly lineitemService: LineitemService) {}

  @Post()
  create(@Body() createLineitemDto: CreateLineitemDto) {
    return this.lineitemService.create(createLineitemDto);
  }

  @Post('bulk')
  createBulk(@Body() createLineitemDto: CreateLineitemDto[]) {
    return this.lineitemService.createBulk(createLineitemDto);
  }

  @Get()
  findAll(@Query('owner') owner: string) {
    return this.lineitemService.findAll(owner);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lineitemService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLineitemDto: UpdateLineitemDto,
  ) {
    return this.lineitemService.update(+id, updateLineitemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lineitemService.remove(+id);
  }
}
