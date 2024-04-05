import { Test, TestingModule } from '@nestjs/testing';
import { GetHubspotCompanyController } from './get_hubspot_company.controller';

describe('GetHubspotCompanyController', () => {
  let controller: GetHubspotCompanyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetHubspotCompanyController],
    }).compile();

    controller = module.get<GetHubspotCompanyController>(GetHubspotCompanyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
