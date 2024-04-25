import { Test, TestingModule } from '@nestjs/testing';
import { QuickbooksApiIntegrationController } from './quickbooks_api_integration.controller';

describe('QuickbooksApiIntegrationController', () => {
  let controller: QuickbooksApiIntegrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuickbooksApiIntegrationController],
    }).compile();

    controller = module.get<QuickbooksApiIntegrationController>(QuickbooksApiIntegrationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
