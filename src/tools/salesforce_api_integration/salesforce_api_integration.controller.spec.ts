import { Test, TestingModule } from '@nestjs/testing';
import { SalesforceApiIntegrationController } from './salesforce_api_integration.controller';

describe('SalesforceApiIntegrationController', () => {
  let controller: SalesforceApiIntegrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesforceApiIntegrationController],
    }).compile();

    controller = module.get<SalesforceApiIntegrationController>(SalesforceApiIntegrationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
