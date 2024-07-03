import { Controller, Get } from '@nestjs/common';

@Controller('tools/zendesk_support_integration')
export class ZendeskSupportIntegrationController {
  @Get()
  async get() {
    try {
      console.log('Getting zendesk support integration');
      return true;
    } catch (error) {
      console.error('Error getting zendesk support integration', error);
    }
  }
}
