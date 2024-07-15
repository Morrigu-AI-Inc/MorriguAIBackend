import { Module } from '@nestjs/common';
import { BrandedFoodService } from './branded_food.service';
import { BrandedFoodController } from './branded_food.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [BrandedFoodController],
  providers: [BrandedFoodService],
  imports: [DbModule]
})
export class BrandedFoodModule {}
