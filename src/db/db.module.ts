import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import PromptFlagSchema from './schemas/PromptFlag';
import { ModelFormattingSchema } from './schemas/ModelFormatting';
import { PromptHistorySchema } from './schemas/PromptHistory';
import { QueryResponseSchema } from './schemas/QueryResponse';
import { QueryResponsePairSchema } from './schemas/QueryResponsePair';
import { ModelSchema } from './schemas/Model';
import { PromptSchema } from './schemas/Prompt';
import {
  ChatMessageSchema,
  HistorySchema,
} from './schemas/ConversationHistory';
import { TeamSchema } from './schemas/Team';
import { EmployeeSchema } from './schemas/Employee';
import { HiringPlanSchema } from './schemas/HiringPlan';
import { MonthlyFinancialDetailSchema } from './schemas/MonthlyFinancialDetail';
import { FinancialCategorySchema } from './schemas/FinancialCategory';
import { OperatingModelSchema } from './schemas/OperatingModel';
import { RevenueDataSchema } from './schemas/RevenueData';
import { RevenueModelSchema } from './schemas/RevenueModel';
import { LeadSchema } from './schemas/Lead';
import { CustomerSchema } from './schemas/Customer';
import { SalesVolumeSchema } from './schemas/SalesVolumn';
import { ResourceItemSchema } from './schemas/ResourceItem';
import { ResourceForecastSchema } from './schemas/ResourceForecast';
import { DatumEntrySchema } from './schemas/DatumEntry';
import { BBSubsDataPointSchema } from './schemas/BBSubsDataPoint';
import { TierSchema } from './schemas/Tier';
import { SubscriptionSchema } from './schemas/Subscription';
import { BillingItemSchema } from './schemas/BillingItem';
import { ExpenseCategorySchema, ExpenseSchema } from './schemas/Expense';
import { MediaSchema } from './schemas/Media';
import { UserSchema } from './schemas/User';
import { VendorSchema } from './schemas/Vendor';
import { RoleSchema } from './schemas/Role';
import { AccountSchema } from './schemas/Account';
import { StripeAccountSchema } from './schemas/StripeAccount';
import { AddressSchema } from './schemas/Address';
import { OrganizationSchema } from './schemas/Organization';
import { OrganizationACLSchema, UserACLSchema } from './schemas/ACL';

const schemas = [
  MongooseModule.forFeature([
    {
      name: 'PromptFlag',
      schema: PromptFlagSchema,
      collection: 'promptFlags',
    },
  ]),
  MongooseModule.forFeature([
    { name: 'ModelFormatting', schema: ModelFormattingSchema },
  ]),
  MongooseModule.forFeature([
    { name: 'PromptHistory', schema: PromptHistorySchema },
  ]),
  MongooseModule.forFeature([
    { name: 'QueryResponse', schema: QueryResponseSchema },
  ]),
  MongooseModule.forFeature([
    { name: 'QueryResponsePair', schema: QueryResponsePairSchema },
  ]),
  MongooseModule.forFeature([{ name: 'Model', schema: ModelSchema }]),
  MongooseModule.forFeature([{ name: 'Prompt', schema: PromptSchema }]),
  MongooseModule.forFeature([{ name: 'History', schema: HistorySchema }]),
  MongooseModule.forFeature([
    { name: 'ChatMessage', schema: ChatMessageSchema },
  ]),
  MongooseModule.forFeature([{ name: 'Team', schema: TeamSchema }]),
  MongooseModule.forFeature([{ name: 'Employee', schema: EmployeeSchema }]),
  MongooseModule.forFeature([{ name: 'HiringPlan', schema: HiringPlanSchema }]),
  MongooseModule.forFeature([
    { name: 'MonthlyFinancialDetail', schema: MonthlyFinancialDetailSchema },
  ]),
  MongooseModule.forFeature([
    { name: 'FinancialCategory', schema: FinancialCategorySchema },
  ]),
  MongooseModule.forFeature([
    { name: 'OperatingModel', schema: OperatingModelSchema },
  ]),
  MongooseModule.forFeature([
    { name: 'RevenueData', schema: RevenueDataSchema },
  ]),
  MongooseModule.forFeature([
    { name: 'RevenueModel', schema: RevenueModelSchema },
  ]),
  MongooseModule.forFeature([{ name: 'Lead', schema: LeadSchema }]),
  MongooseModule.forFeature([{ name: 'Customer', schema: CustomerSchema }]),
  MongooseModule.forFeature([
    { name: 'SalesVolume', schema: SalesVolumeSchema },
  ]),
  MongooseModule.forFeature([
    { name: 'ResourceItem', schema: ResourceItemSchema },
  ]),
  MongooseModule.forFeature([
    { name: 'ResourceForecast', schema: ResourceForecastSchema },
  ]),
  MongooseModule.forFeature([{ name: 'DatumEntry', schema: DatumEntrySchema }]),
  MongooseModule.forFeature([
    { name: 'BBSubsDataPoint', schema: BBSubsDataPointSchema },
  ]),
  MongooseModule.forFeature([{ name: 'Tier', schema: TierSchema }]),
  MongooseModule.forFeature([
    { name: 'Subscription', schema: SubscriptionSchema },
  ]),
  MongooseModule.forFeature([
    { name: 'BillingItem', schema: BillingItemSchema },
  ]),
  MongooseModule.forFeature([{ name: 'Expense', schema: ExpenseSchema }]),
  MongooseModule.forFeature([
    { name: 'ExpenseCategory', schema: ExpenseCategorySchema },
  ]),
  MongooseModule.forFeature([{ name: 'Vendor', schema: VendorSchema }]),
  MongooseModule.forFeature([{ name: 'Media', schema: MediaSchema }]),
  MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  MongooseModule.forFeature([{ name: 'Role', schema: RoleSchema }]),
  MongooseModule.forFeature([{ name: 'Account', schema: AccountSchema }]),
  MongooseModule.forFeature([
    { name: 'StripeAccount', schema: StripeAccountSchema },
  ]),
  MongooseModule.forFeature([{ name: 'Address', schema: AddressSchema }]),
  MongooseModule.forFeature([
    { name: 'Organization', schema: OrganizationSchema },
  ]),
  MongooseModule.forFeature([{ name: 'UserACL', schema: UserACLSchema }]),
  MongooseModule.forFeature([{ name: 'OrganizationACL', schema: OrganizationACLSchema }]),
];

@Module({
  imports: schemas,
  exports: schemas,
})
export class DbModule {}
