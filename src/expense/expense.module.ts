import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { MediaService } from 'src/media/media.service';
import { ExpenseController } from './expense.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  providers: [ExpenseService, MediaService],
  controllers: [ExpenseController],
  imports: [DbModule],
})
export class ExpenseModule {}
