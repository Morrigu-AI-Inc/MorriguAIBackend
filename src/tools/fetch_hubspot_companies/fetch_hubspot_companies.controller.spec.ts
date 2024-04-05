import { Test, TestingModule } from '@nestjs/testing';
import { FetchHubspotCompaniesController } from './fetch_hubspot_companies.controller';

describe('FetchHubspotCompaniesController', () => {
  let controller: FetchHubspotCompaniesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FetchHubspotCompaniesController],
    }).compile();

    controller = module.get<FetchHubspotCompaniesController>(FetchHubspotCompaniesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
