import { Module } from '@nestjs/common';
import { StripeAccountService } from './stripe_account.service';
import { StripeAccountController } from './stripe_account.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [StripeAccountController],
  providers: [StripeAccountService],
  imports: [DbModule]
})
export class StripeAccountModule {}
