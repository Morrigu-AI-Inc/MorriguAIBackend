import { Module } from '@nestjs/common';
import { FinancialDataPointCommitController } from './financial_data_point_commit.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [FinancialDataPointCommitController],
  imports: [DbModule],
})
export class FinancialDataPointCommitModule {}
