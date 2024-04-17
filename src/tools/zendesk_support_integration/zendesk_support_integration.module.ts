import { Module } from '@nestjs/common';
import { ZendeskSupportIntegrationController } from './zendesk_support_integration.controller';

@Module({
  controllers: [ZendeskSupportIntegrationController]
})
export class ZendeskSupportIntegrationModule {}
