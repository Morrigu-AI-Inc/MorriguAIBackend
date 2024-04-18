import { Module } from '@nestjs/common';
import { SlackApiIntegrationController } from './slack_api_integration.controller';

@Module({
  controllers: [SlackApiIntegrationController]
})
export class SlackApiIntegrationModule {}
