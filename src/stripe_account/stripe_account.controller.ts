import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { StripeAccountService } from './stripe_account.service';
import { CreateStripeAccountDto } from './dto/create-stripe_account.dto';
import { UpdateStripeAccountDto } from './dto/update-stripe_account.dto';

@Controller('stripe-account')
export class StripeAccountController {
  constructor(private readonly stripeAccountService: StripeAccountService) {}

  @Post()
  create(
    @Body() createStripeAccountDto: CreateStripeAccountDto,
    @Query('owner') owner: string,
  ) {
    return this.stripeAccountService.create(createStripeAccountDto, owner);
  }

  @Get('/all')
  findAll(@Query('owner') owner: string) {
    return this.stripeAccountService.findAll(owner);
  }

  @Get()
  findOne(@Query('owner') owner: string) {
    return this.stripeAccountService.findOne(owner);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStripeAccountDto: UpdateStripeAccountDto,
  ) {
    return this.stripeAccountService.update(+id, updateStripeAccountDto);
  }

  @Delete()
  remove(@Query('owner') owner: string) {
    return this.stripeAccountService.remove(owner);
  }
}
