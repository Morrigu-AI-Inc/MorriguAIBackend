import { Module } from '@nestjs/common';
import { RevenueModelService } from './revenue-model.service';
import { DbModule } from 'src/db/db.module';
import { RevenueModelController } from './revenue-model.controller';

@Module({
  providers: [RevenueModelService],
  imports: [DbModule],
  controllers: [RevenueModelController],
})
export class RevenueModelModule {}
