// accounts.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from 'src/db/schemas/Account';
import { User, UserDocument } from 'src/db/schemas/User';

// dtos/create-account.dto.ts
export class CreateAccountDto {
  readonly name: string;
  readonly type: string;
  readonly accountNumber: string;
  readonly currentBalance: number;
  readonly currency: string;
  readonly creditLimit?: number;
  readonly lastActivityDate: Date;
  readonly status: string;
  readonly bankName?: string;
  readonly branchCode?: string;
  readonly swiftCode?: string;
}

// dtos/update-account.dto.ts
export class UpdateAccountDto {
  readonly name?: string;
  readonly type?: string;
  readonly accountNumber?: string;
  readonly currentBalance?: number;
  readonly currency?: string;
  readonly creditLimit?: number;
  readonly lastActivityDate?: Date;
  readonly status?: string;
  readonly bankName?: string;
  readonly branchCode?: string;
  readonly swiftCode?: string;
}

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const newAccount = new this.accountModel(createAccountDto);
    return newAccount.save();
  }

  async findAll(owner): Promise<Account[]> {
    //
    const user = await this.userModel.find({ id: owner }).exec();

    //

    if (!user) {
      throw new Error('User not found');
    }

    return this.accountModel
      .find({
        owner,
      })
      .exec();
  }

  async findOne(id: string, owner: string): Promise<Account> {
    const user = await this.userModel
      .findOne({
        id: owner,
      })
      .exec();

    if (!user) {
      throw new Error('User not found');
    }

    const account = await this.accountModel
      .findOne({
        _id: id,
        owner,
      })
      .exec();

    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return account;
  }

  async update(
    id: string,
    updateAccountDto: UpdateAccountDto,
    owner,
  ): Promise<Account> {
    const user = await this.userModel.findOne({ id: owner }).exec();

    if (!user) {
      throw new Error('User not found');
    }

    const updatedAccount = await this.accountModel.findOneAndUpdate(
      {
        _id: id,
        owner,
      },
      updateAccountDto,
      { new: true },
    );
    if (!updatedAccount) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return updatedAccount;
  }

  async remove(id: string, owner): Promise<any> {
    const user = await this.userModel.findOne({ id: owner }).exec();

    if (!user) {
      throw new Error('User not found');
    }

    const result = await this.accountModel.deleteOne({ _id: id, owner }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    return result;
  }
}
