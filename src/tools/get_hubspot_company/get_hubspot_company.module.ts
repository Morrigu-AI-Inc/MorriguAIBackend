import { Module } from '@nestjs/common';
import { GetHubspotCompanyController } from './get_hubspot_company.controller';

@Module({
  controllers: [GetHubspotCompanyController]
})
export class GetHubspotCompanyModule {}
