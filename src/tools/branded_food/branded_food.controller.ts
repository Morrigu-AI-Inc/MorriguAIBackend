import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BrandedFoodService } from './branded_food.service';
import { CreateBrandedFoodDto } from './dto/create-branded_food.dto';
import { UpdateBrandedFoodDto } from './dto/update-branded_food.dto';

@Controller('tools/branded_food')
export class BrandedFoodController {
  constructor(private readonly brandedFoodService: BrandedFoodService) {}

  @Post()
  create(@Body() createBrandedFoodDto: CreateBrandedFoodDto) {
    return this.brandedFoodService.create(createBrandedFoodDto);
  }

  @Get()
  findAll() {
    return this.brandedFoodService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandedFoodService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBrandedFoodDto: UpdateBrandedFoodDto) {
    return this.brandedFoodService.update(+id, updateBrandedFoodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandedFoodService.remove(+id);
  }
}
