import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BillingItem, BillingItemDocument } from 'src/db/schemas/BillingItem';
import {
  Subscription,
  SubscriptionDocument,
} from 'src/db/schemas/Subscription';
import { Tier, TierDocument } from 'src/db/schemas/Tier';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Tier.name) private tierModel: Model<TierDocument>,
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(BillingItem.name)
    private billingItemModel: Model<BillingItemDocument>,
  ) {}

  async createTier(
    name: string,
    price: number,
    features: string[],
  ): Promise<Tier> {
    return new this.tierModel({ name, price, features }).save();
  }

  async getAllTiers(): Promise<Tier[]> {
    return this.tierModel.find().exec();
  }

  async createSubscription(
    userId: string,
    tierId: string,
    startDate: Date,
  ): Promise<Subscription> {
    return new this.subscriptionModel({
      user: userId,
      tier: tierId,
      startDate,
      isActive: true,
    }).save();
  }

  async deactivateSubscription(subscriptionId: string): Promise<Subscription> {
    return this.subscriptionModel.findByIdAndUpdate(
      subscriptionId,
      { isActive: false, endDate: new Date() },
      { new: true },
    );
  }

  async createBillingItem(
    subscriptionId: string,
    amount: number,
    billingDate: Date,
    nextBillingDate: Date,
  ): Promise<BillingItem> {
    return new this.billingItemModel({
      subscription: subscriptionId,
      amount,
      billingDate,
      nextBillingDate,
    }).save();
  }

  async getBillingItemsForSubscription(
    subscriptionId: string,
  ): Promise<BillingItem[]> {
    return this.billingItemModel.find({ subscription: subscriptionId }).exec();
  }
}
