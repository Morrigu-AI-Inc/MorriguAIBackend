// accounts.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import {
  AccountsService,
  CreateAccountDto,
  UpdateAccountDto,
} from './accounts.service';
import { Account } from 'src/db/schemas/Account';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAccountDto: CreateAccountDto): Promise<Account> {
    return this.accountsService.create(createAccountDto);
  }

  @Get()
  async findAll(@Query('owner') owner: string): Promise<Account[]> {
    return this.accountsService.findAll(owner);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('owner') owner: string,
  ): Promise<Account> {
    return this.accountsService.findOne(id, owner);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Query('owner') owner: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    return this.accountsService.update(id, updateAccountDto, owner);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @Query('owner') owner: string,
  ): Promise<void> {
    await this.accountsService.remove(id, owner);
  }
}
