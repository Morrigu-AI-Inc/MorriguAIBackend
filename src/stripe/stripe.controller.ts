import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Put,
  Req,
} from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('customer')
  async createCustomer(
    @Body() createCustomerDto: { email: string; name: string },
  ) {
    console.log('Creating customer:', createCustomerDto);
    return this.stripeService.fetchOrCreateNew(
      createCustomerDto.email,
      createCustomerDto.name,
    );
  }

  @Get('customers')
  async findAllCustomers() {
    return this.stripeService.findAllCustomers();
  }

  @Get('customer/:id')
  async findOneCustomer(@Param('id') id: string) {
    return this.stripeService.findOneCustomer(id);
  }

  @Put('customer/:id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() updateCustomerDto: { email: string; name: string },
  ) {
    return this.stripeService.updateCustomer(
      id,
      updateCustomerDto.email,
      updateCustomerDto.name,
    );
  }

  @Delete('customer/:id')
  async removeCustomer(@Param('id') id: string) {
    return this.stripeService.removeCustomer(id);
  }

  @Post('customer/:customerId/card')
  async saveCard(
    @Param('customerId') customerId: string,
    @Body() cardDto: object,
  ) {
    console.log('Saving card:', cardDto);
    return this.stripeService.saveCard(customerId, {
      card: cardDto,
    });
  }

  @Get('customer/:customerId/cards')
  async listCards(@Param('customerId') customerId: string) {
    return this.stripeService.listCards(customerId);
  }

  @Delete('customer/:customerId/card/:cardId')
  async removeCard(
    @Param('customerId') customerId: string,
    @Param('cardId') cardId: string,
  ) {
    return this.stripeService.removeCard(customerId, cardId);
  }
}
