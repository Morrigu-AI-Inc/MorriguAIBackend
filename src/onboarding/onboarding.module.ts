import { Module } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { OnboardingController } from './onboarding.controller';
import { DbModule } from 'src/db/db.module';
import { StripeService } from 'src/stripe/stripe.service';
import { OrganizationModule } from 'src/organization/organization.module';

@Module({
  controllers: [OnboardingController],
  providers: [OnboardingService, StripeService],
  imports: [DbModule],
})
export class OnboardingModule {}
