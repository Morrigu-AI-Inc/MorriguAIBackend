import { Test, TestingModule } from '@nestjs/testing';
import { NotionApiIntegrationController } from './notion_api_integration.controller';

describe('NotionApiIntegrationController', () => {
  let controller: NotionApiIntegrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotionApiIntegrationController],
    }).compile();

    controller = module.get<NotionApiIntegrationController>(NotionApiIntegrationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
