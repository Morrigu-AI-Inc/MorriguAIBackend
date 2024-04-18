import { Controller, Get } from '@nestjs/common';

@Controller('tools/slack_api_integration')
export class SlackApiIntegrationController {
  @Get()
  async slackApiIntegration() {
    console.log('This is the slack_api_integration tool. Not implemented yet');
    return {
      message: 'This is the slack_api_integration tool. Not implemented yet',
    };
  }
}
