import { Module } from '@nestjs/common';
import { QuickbooksApiIntegrationController } from './quickbooks_api_integration.controller';

@Module({
  controllers: [QuickbooksApiIntegrationController]
})
export class QuickbooksApiIntegrationModule {}
