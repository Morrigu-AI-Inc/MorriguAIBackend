import { Module } from '@nestjs/common';
import { HubspotApiIntegrationController } from './hubspot_api_integration.controller';

@Module({
  controllers: [HubspotApiIntegrationController]
})
export class HubspotApiIntegrationModule {}
