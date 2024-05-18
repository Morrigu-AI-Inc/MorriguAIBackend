import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrganizationaclsService } from './organizationacls.service';
import { CreateOrganizationaclDto } from './dto/create-organizationacl.dto';
import { UpdateOrganizationaclDto } from './dto/update-organizationacl.dto';

@Controller('organizationacls')
export class OrganizationaclsController {
  constructor(private readonly organizationaclsService: OrganizationaclsService) {}

  @Post()
  create(@Body() createOrganizationaclDto: CreateOrganizationaclDto) {
    return this.organizationaclsService.create(createOrganizationaclDto);
  }

  @Get()
  findAll() {
    return this.organizationaclsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationaclsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrganizationaclDto: UpdateOrganizationaclDto) {
    return this.organizationaclsService.update(+id, updateOrganizationaclDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationaclsService.remove(+id);
  }
}
