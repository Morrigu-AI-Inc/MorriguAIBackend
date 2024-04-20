import { Module } from '@nestjs/common';
import { NotionApiIntegrationController } from './notion_api_integration.controller';

@Module({
  controllers: [NotionApiIntegrationController]
})
export class NotionApiIntegrationModule {}
