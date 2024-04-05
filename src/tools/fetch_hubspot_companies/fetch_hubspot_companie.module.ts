import { Module } from '@nestjs/common';
import { FetchHubspotCompaniesController } from './fetch_hubspot_companies.controller';

@Module({
  controllers: [FetchHubspotCompaniesController]
})
export class FetchHubspotCompaniesModule {}
