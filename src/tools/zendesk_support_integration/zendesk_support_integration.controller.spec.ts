import { Test, TestingModule } from '@nestjs/testing';
import { ZendeskSupportIntegrationController } from './zendesk_support_integration.controller';

describe('ZendeskSupportIntegrationController', () => {
  let controller: ZendeskSupportIntegrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZendeskSupportIntegrationController],
    }).compile();

    controller = module.get<ZendeskSupportIntegrationController>(ZendeskSupportIntegrationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
