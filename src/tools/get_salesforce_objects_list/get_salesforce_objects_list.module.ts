import { Module } from '@nestjs/common';
import { GetSalesforceObjectsListController } from './get_salesforce_objects_list.controller';

@Module({
  controllers: [GetSalesforceObjectsListController]
})
export class GetSalesforceObjectsListModule {}
