import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UseraclsService } from './useracls.service';
import { CreateUseraclDto } from './dto/create-useracl.dto';
import { UpdateUseraclDto } from './dto/update-useracl.dto';

@Controller('useracls')
export class UseraclsController {
  constructor(private readonly useraclsService: UseraclsService) {}

  @Post()
  create(@Body() createUseraclDto: CreateUseraclDto) {
    return this.useraclsService.create(createUseraclDto);
  }

  @Get()
  findAll() {
    return this.useraclsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.useraclsService.findOne(+id);
  }

  @Post(':id')
  update(@Param('id') id: string, @Body() updateUseraclDto: UpdateUseraclDto) {
    console.log('id', id);
    console.log('updateUseraclDto', updateUseraclDto);
    return this.useraclsService.update(id, updateUseraclDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.useraclsService.remove(+id);
  }
}
