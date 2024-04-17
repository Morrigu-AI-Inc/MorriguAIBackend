import { Test, TestingModule } from '@nestjs/testing';
import { GithubApiIntegrationController } from './github_api_integration.controller';

describe('GithubApiIntegrationController', () => {
  let controller: GithubApiIntegrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GithubApiIntegrationController],
    }).compile();

    controller = module.get<GithubApiIntegrationController>(GithubApiIntegrationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
