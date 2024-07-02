// src/expenses/expenses.controller.ts
import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  Req,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExpenseService } from './expense.service';
import * as jwt from 'jsonwebtoken';
import { MediaDocument } from 'src/db/schemas/Media';

import { Model } from 'mongoose';
import { User } from 'src/db/schemas/User';

type CreateExpenseDto = {
  amount: number;
  date: string;
  category: string;
  vendor: string;
  description: string;
  owner: string;
  processedFiles: any[];
};

type UpdateExpenseDto = {
  amount: number;
  date: string;
  category: string;
  description: string;
};

@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  async createExpense(@Body() createExpenseDto: CreateExpenseDto) {
    try {
      

      const expense = await this.expenseService.createExpense(
        createExpenseDto.amount,
        new Date(createExpenseDto.date),
        createExpenseDto.category,
        createExpenseDto.vendor,
        createExpenseDto.description,
        createExpenseDto.owner,
        createExpenseDto.processedFiles,
      );

      

      return expense;
    } catch (error) {
      return { error: error.message };
    }
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('receipt'))
  async updateExpense(
    @Param('id') id: string,
    @UploadedFile() file: any,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @Req() req: any,
  ) {
    try {
      const owner = req.user.id;
      return await this.expenseService.updateExpense(
        id,
        updateExpenseDto.amount,
        new Date(updateExpenseDto.date),
        updateExpenseDto.category,
        updateExpenseDto.description,
        owner,
        file,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  async getExpenses(@Query('owner') owner: string, @Req() req: any) {
    try {
      return this.expenseService.getExpenses(owner);
    } catch (error) {
      return error;
    }
  }

  @Get('item/:id')
  async getExpenseById(@Param('id') id: string, @Req() req: any) {
    const owner = req.user.id;
    return await this.expenseService.getExpenseById(id, owner);
  }

  @Get('receipt/:id')
  async getExpenseReceipt(@Param('id') id: string) {
    return await this.expenseService.getExpenseReceipt(id);
  }

  @Delete('item/:id')
  async deleteExpense(@Param('id') id: string, @Req() req: any) {
    const owner = req.user.id;
    return await this.expenseService.deleteExpense(id, owner);
  }

  // =============== MANAGE THE EXPENSE CATEGORIES ===============

  @Get('categories')
  async getCategories(@Query('owner') owner: string) {
    return await this.expenseService.getExpenseCategoryByOwner(owner);
  }

  @Post('categories')
  async createCategory(@Body() category: any) {
    try {
      return await this.expenseService.createExpenseCategory(category);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Put('categories/:id')
  async updateCategory(
    @Query('owner') owner: string,
    @Param('id') id: string,
    @Body() category: any,
  ) {
    return await this.expenseService.updateExpenseCategory(id, owner, category);
  }

  @Delete('categories/:id')
  async deleteCategory(@Query('owner') owner: string, @Param('id') id: string) {
    return await this.expenseService.deleteExpenseCategory(id, owner);
  }

  @Get('categories/:id')
  async getCategoryById(
    @Param('id') id: string,
    @Query('owner') owner: string,
  ) {
    return await this.expenseService.getExpenseCategoryByOwnerAndId(owner, id);
  }
}
