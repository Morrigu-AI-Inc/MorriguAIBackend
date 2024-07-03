import { Injectable } from '@nestjs/common';
import { CreateStripeAccountDto } from './dto/create-stripe_account.dto';
import { UpdateStripeAccountDto } from './dto/update-stripe_account.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  StripeAccount,
  StripeAccountDocument,
} from 'src/db/schemas/StripeAccount';
import { User } from 'src/db/schemas/User';
import stripe from 'stripe';

@Injectable()
export class StripeAccountService {
  constructor(
    // Inject the StripeAccount model
    @InjectModel(StripeAccount.name)
    private stripeAccountModel: Model<StripeAccountDocument>,
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async create(createStripeAccountDto: CreateStripeAccountDto, owner: string) {
    // we need to create a new stripe customer account
    // then we need to create a new stripe account in the database
    // we need to return the stripe account
    const client = new stripe(process.env.STRIPE_SECRET_KEY);

    return client.customers
      .create({
        email: createStripeAccountDto.user.email,
        name: createStripeAccountDto.user.name,
        address: {
          line1: createStripeAccountDto.address.street,
          city: createStripeAccountDto.address.city,
          state: createStripeAccountDto.address.state,
          postal_code: createStripeAccountDto.address.postalCode,
          country: createStripeAccountDto.address.country,
        },
      })
      .then(async (customer) => {
        const acct = await this.stripeAccountModel.create({
          _id: owner,
          stripeCustomerId: customer.id,
          accountIds: [],
        });

        const stripeAcct = await this.userModel.findOneAndUpdate(
          {
            id: owner,
          },
          {
            stripeAccount: acct,
          },
        );

        return stripeAcct;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async findAll(owner: string) {
    const user = await this.userModel.findOne({ id: owner });

    if (!user) {
      return [];
    }

    const stripeAcct = await this.stripeAccountModel.findOne({
      _id: user.stripeAccount,
    });

    return [stripeAcct];
  }

  async findOne(owner: string) {
    return (await this.userModel.findOne({ id: owner })).stripeAccount;
  }

  update(id: number, updateStripeAccountDto: UpdateStripeAccountDto) {
    return `This action updates a #${id} stripeAccount`;
  }

  async remove(owner: string) {
    const user = await this.userModel.findOne({ id: owner });

    if (!user) {
      return;
    }

    await this.stripeAccountModel.deleteOne({ _id: user.stripeAccount });

    await this.userModel.findOneAndUpdate(
      { id: owner },
      {
        stripeAccount: null,
      },
    );

    return;
  }
}
