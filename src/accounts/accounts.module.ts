import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { DbModule } from 'src/db/db.module';
import { AccountsController } from './accounts.controller';

@Module({
  providers: [AccountsService],
  imports: [DbModule],
  controllers: [AccountsController],
})
export class AccountsModule {}
