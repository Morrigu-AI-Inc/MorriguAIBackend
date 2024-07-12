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
import { PurchasingService } from './purchasing.service';
import { CreatePurchasingDto } from './dto/create-purchasing.dto';
import { UpdatePurchasingDto } from './dto/update-purchasing.dto';

@Controller('purchasing')
export class PurchasingController {
  constructor(private readonly purchasingService: PurchasingService) {}

  @Post()
  create(@Body() createPurchasingDto: CreatePurchasingDto) {
    return this.purchasingService.create(createPurchasingDto);
  }

  @Get()
  findAll(@Query('owner') owner: string) {
    return this.purchasingService.findAll(owner);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchasingService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePurchasingDto: UpdatePurchasingDto,
  ) {
    return this.purchasingService.update(id, updatePurchasingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchasingService.remove(id);
  }
}
