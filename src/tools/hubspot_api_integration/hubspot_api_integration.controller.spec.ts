import { Test, TestingModule } from '@nestjs/testing';
import { HubspotApiIntegrationController } from './hubspot_api_integration.controller';

describe('HubspotApiIntegrationController', () => {
  let controller: HubspotApiIntegrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HubspotApiIntegrationController],
    }).compile();

    controller = module.get<HubspotApiIntegrationController>(HubspotApiIntegrationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
