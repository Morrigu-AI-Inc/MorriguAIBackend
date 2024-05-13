// src/expenses/expenses.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import { Model, Types } from 'mongoose';
import * as path from 'path';
import {
  ExpenseCategoryDocument,
  ExpenseDocument,
} from 'src/db/schemas/Expense';
import { Media, MediaDocument } from 'src/db/schemas/Media';
import { UserDocument } from 'src/db/schemas/User';
import { MediaService } from 'src/media/media.service';

@Injectable()
export class ExpenseService {
  constructor(
    private mediaService: MediaService,
    @InjectModel('Expense')
    private readonly expenseModel: Model<ExpenseDocument>,
    @InjectModel('ExpenseCategory')
    private readonly expenseCategoryModel: Model<ExpenseCategoryDocument>,
    @InjectModel('User')
    private readonly userModel: Model<UserDocument>,
  ) {}

  async uploadReceipt(file: any): Promise<MediaDocument | Error> {
    return this.mediaService.uploadFile(file);
  }

  async deleteExpense(
    expenseId: string,
    owner: string,
  ): Promise<ExpenseDocument | Error> {
    try {
      const deletedExpense = await this.expenseModel.findOneAndDelete({
        _id: expenseId,
        owner: owner,
      });

      if (deletedExpense) {
        for (const mediaId of deletedExpense.media) {
          const media = await this.mediaService.deleteMedia(mediaId);
          if (!media) {
            throw new Error('Media not found');
          }
          if (media.url) {
            fs.unlinkSync(
              path.join(__dirname, '..', '..', 'uploads', media.url),
            );
          }
        }
      }

      if (!deletedExpense) {
        throw new Error('Expense not found');
      }

      return deletedExpense;
    } catch (error) {
      return error;
    }
  }

  async getExpenses(userId: string): Promise<ExpenseDocument[]> {
    console.log(userId);
    const user = await this.userModel.findOne({ id: userId }).exec();

    console.log(user);

    if (!user) {
      throw new Error('User not found');
    }

    try {
      const results = this.expenseModel
        .find({ owner: user._id })
        .populate('media owner category vendor')
        .exec();

      console.log(results);
      return results;
    } catch (error) {
      console.log(error);
      return [];
    }
   
  }

  async createDBExpense(
    amount: number,
    date: Date,
    category: string,
    description: string,
    receiptUrl: string,
    mediaId: string,
    owner: string,
  ): Promise<ExpenseDocument> {
    return this.expenseModel.create({
      amount,
      date,
      category,
      description,
      receiptUrl: [receiptUrl],
      media: [mediaId],
      owner,
    });
  }

  async createExpense(
    amount: number,
    date: Date,
    category: string,
    vendor: string,
    description: string,
    owner: string,
    files: {
      name: string;
      url: string;
      data: MediaDocument;
    }[],
  ): Promise<ExpenseDocument> {
    console.log('vendor', vendor);
    const user = await this.userModel.findOne({ id: owner }).exec();

    const expense = await this.expenseModel.create({
      amount,
      date,
      category,
      description,
      receiptUrl: files.map((file) => file.url),
      media: files.map((file) => file.data._id),
      vendor: vendor,
      owner: user._id,
    });

    return expense;
  }

  async updateExpense(
    expenseId: string,
    amount: number,
    date: Date,
    category: string,
    description: string,
    owner: string,
    file: any,
  ): Promise<ExpenseDocument | Error> {
    const expense = await this.expenseModel.findOne({ _id: expenseId });

    if (!expense) {
      throw new Error('Expense not found');
    }

    if ((expense.owner as any) !== owner) {
      throw new Error('You do not have permission to update this expense');
    }

    let media = null;
    if (file) {
      media = await this.uploadReceipt(file);
      if (media instanceof Error) {
        throw media;
      }
    }

    const updatedExpense = await this.expenseModel.findOneAndUpdate(
      { _id: expenseId },
      {
        amount,
        date,
        category,
        description,
        receiptUrl: [media ? media.url : expense.receiptUrl],
        media: media ? [media._id] : expense.media,
      },
      { new: true },
    );

    return updatedExpense;
  }

  async getExpenseById(
    expenseId: string,
    owner: string,
  ): Promise<ExpenseDocument | Error> {
    const expense = await this.expenseModel.findOne({
      _id: expenseId,
      owner: owner,
    });

    if (!expense) {
      throw new Error('Expense not found');
    }

    return expense;
  }

  async getExpensesByCategory(
    category: string,
    owner: string,
  ): Promise<ExpenseDocument[]> {
    return this.expenseModel.find({ category, owner });
  }

  async getExpensesByDate(
    date: Date,
    owner: string,
  ): Promise<ExpenseDocument[]> {
    return this.expenseModel.find({ date, owner });
  }

  async getExpensesByDateRange(
    startDate: Date,
    endDate: Date,
    owner: string,
  ): Promise<ExpenseDocument[]> {
    return this.expenseModel.find({
      date: { $gte: startDate, $lte: endDate },
      owner,
    });
  }

  async getExpensesByAmount(
    amount: number,
    owner: string,
  ): Promise<ExpenseDocument[]> {
    return this.expenseModel.find({ amount, owner });
  }

  async getExpensesByAmountRange(
    minAmount: number,
    maxAmount: number,
    owner: string,
  ): Promise<ExpenseDocument[]> {
    return this.expenseModel.find({
      amount: { $gte: minAmount, $lte: maxAmount },
      owner,
    });
  }

  async getExpenseReceipt(expenseId: string): Promise<string[]> {
    const expense = await this.expenseModel.findOne({ _id: expenseId });

    if (!expense) {
      throw new Error('Expense not found');
    }

    const base64string = [];
    for (const mediaId of expense.media) {
      const media = await this.mediaService.getMediaBase64(mediaId);
      base64string.push(media);
    }

    return base64string;
  }

  //   @Schema()
  // export class ExpenseCategory extends Document {
  //   @Prop({ required: true })
  //   name: string;

  //   @Prop()
  //   description: string;

  //   @Prop({ required: true })
  //   color: string;
  // }
  // logic for the above schema

  async createExpenseCategory(cat) {
    return await this.expenseCategoryModel.create(cat);
  }

  async getExpenseCategories() {
    return this.expenseCategoryModel.find();
  }

  async deleteExpenseCategory(categoryId: string, orgId: string) {
    return this.expenseCategoryModel.findOneAndDelete({
      _id: categoryId,
      owner: orgId,
    });
  }

  async updateExpenseCategory(id, owner, category) {
    return this.expenseCategoryModel.findOneAndUpdate(
      {
        _id: category._id,
        owner: owner,
      },
      category,
      { new: true },
    );
  }

  async getExpenseCategoryById(categoryId: string) {
    return this.expenseCategoryModel.findOne({ _id: categoryId });
  }

  getExpenseCategoryByOwner(ownerId: string) {
    return this.expenseCategoryModel.find({ owner: ownerId });
  }

  async getExpenseCategoryByName(name: string) {
    return this.expenseCategoryModel.findOne({ name });
  }

  async getExpenseCategoryByColor(color: string) {
    return this.expenseCategoryModel.findOne({
      color,
    });
  }

  async getExpenseCategoryByOwnerAndName(ownerId: string, name: string) {
    return this.expenseCategoryModel.findOne({
      owner: ownerId,
      name,
    });
  }

  async getExpenseCategoryByOwnerAndColor(ownerId: string, color: string) {
    return this.expenseCategoryModel.findOne({
      owner: ownerId,
      color,
    });
  }

  async getExpenseCategoryByNameAndColor(name: string, color: string) {
    return this.expenseCategoryModel.findOne({
      name,
      color,
    });
  }

  async getExpenseCategoryByOwnerNameAndColor(
    ownerId: string,
    name: string,
    color: string,
  ) {
    return this.expenseCategoryModel.findOne({
      owner: ownerId,
      name,
      color,
    });
  }

  async getExpenseCategoryByOwnerAndId(ownerId: string, categoryId: string) {
    return this.expenseCategoryModel.findOne({
      owner: ownerId,
      _id: categoryId,
    });
  }
}
