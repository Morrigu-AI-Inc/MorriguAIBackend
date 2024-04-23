import { Module } from '@nestjs/common';
import { SalesforceApiIntegrationController } from './salesforce_api_integration.controller';

@Module({
  controllers: [SalesforceApiIntegrationController]
})
export class SalesforceApiIntegrationModule {}
