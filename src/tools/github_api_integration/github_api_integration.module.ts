import { Module } from '@nestjs/common';
import { GithubApiIntegrationController } from './github_api_integration.controller';

@Module({
  controllers: [GithubApiIntegrationController]
})
export class GithubApiIntegrationModule {}
