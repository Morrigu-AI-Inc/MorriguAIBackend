import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [SubscriptionsController],
  providers: [SubscriptionService],
  imports: [DbModule],
})
export class SubscriptionsModule {}
