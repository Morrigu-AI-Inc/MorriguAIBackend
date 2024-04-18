import { Test, TestingModule } from '@nestjs/testing';
import { SlackApiIntegrationController } from './slack_api_integration.controller';

describe('SlackApiIntegrationController', () => {
  let controller: SlackApiIntegrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SlackApiIntegrationController],
    }).compile();

    controller = module.get<SlackApiIntegrationController>(SlackApiIntegrationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
