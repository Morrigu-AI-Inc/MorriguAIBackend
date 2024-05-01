import { Module } from '@nestjs/common';
import { HiringPlanService } from './hiring-plan.service';
import { DbModule } from 'src/db/db.module';
import { HiringPlanController } from './hiring-plan.controller';

@Module({
  providers: [HiringPlanService],
  imports: [DbModule],
  controllers: [HiringPlanController],
})
export class HiringPlanModule {}
