import { Injectable } from '@nestjs/common';
import { CreateBrandedFoodDto } from './dto/create-branded_food.dto';
import { UpdateBrandedFoodDto } from './dto/update-branded_food.dto';

@Injectable()
export class BrandedFoodService {
  create(createBrandedFoodDto: CreateBrandedFoodDto) {
    return 'This action adds a new brandedFood';
  }

  findAll() {
    return `This action returns all brandedFood`;
  }

  findOne(id: number) {
    return `This action returns a #${id} brandedFood`;
  }

  update(id: number, updateBrandedFoodDto: UpdateBrandedFoodDto) {
    return `This action updates a #${id} brandedFood`;
  }

  remove(id: number) {
    return `This action removes a #${id} brandedFood`;
  }
}
