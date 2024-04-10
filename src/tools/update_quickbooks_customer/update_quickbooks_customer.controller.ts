import { Controller, Get, Query } from '@nestjs/common';

@Controller('tools/update_quickbooks_customer')
export class UpdateQuickbooksCustomerController {
  @Get()
  async updateQuickbooksCustomer(
    @Query('parameters') parameters: string,
  ): Promise<any> {
    try {
      return {
        params: JSON.parse(parameters),
        warning:
          'This endpoint is not yet implemented. But you have reached it.',
      };
    } catch (e) {
      console.error('Error in quickbooksQueryCustomers', e);
      return e;
    }
  }
}
