import { Module } from '@nestjs/common';
import { SalesforceQueryController } from './salesforce_query.controller';

@Module({
  controllers: [SalesforceQueryController]
})
export class SalesforceQueryModule {}
