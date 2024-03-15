import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BillingPlanSchema,
  BillingSchema,
  TierSchema,
} from 'src/db/schemas/Billing';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Billing', schema: BillingSchema },
      { name: 'BillingPlan', schema: BillingPlanSchema },
      { name: 'Tier', schema: TierSchema },
    ]),
  ],
})
export class BillingModule {}
