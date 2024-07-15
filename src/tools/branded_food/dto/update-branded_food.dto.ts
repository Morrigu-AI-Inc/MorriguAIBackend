import { PartialType } from '@nestjs/swagger';
import { CreateBrandedFoodDto } from './create-branded_food.dto';

export class UpdateBrandedFoodDto extends PartialType(CreateBrandedFoodDto) {}
