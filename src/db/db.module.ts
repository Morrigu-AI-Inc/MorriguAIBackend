import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import PromptFlagSchema from './schemas/PromptFlag';
import { MediaSchema } from './schemas/Media';
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
import { AssistantSchema } from './schemas/Assistant';
import { AgentSchema } from './schemas/Agent';
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

@Module({
  imports: [
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
    MongooseModule.forFeature([
      { name: 'HiringPlan', schema: HiringPlanSchema },
    ]),
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
  ],
  exports: [
    MongooseModule.forFeature([
      { name: 'PromptFlag', schema: PromptFlagSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Media', schema: MediaSchema }]),
    MongooseModule.forFeature([
      { name: 'ModelFormatting', schema: ModelFormattingSchema },
    ]),
    MongooseModule.forFeature([{ name: 'History', schema: HistorySchema }]),
    MongooseModule.forFeature([
      { name: 'ChatMessage', schema: ChatMessageSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Assistant', schema: AssistantSchema }]),
    MongooseModule.forFeature([{ name: 'Agent', schema: AgentSchema }]),
    MongooseModule.forFeature([{ name: 'Team', schema: TeamSchema }]),
    MongooseModule.forFeature([{ name: 'Employee', schema: EmployeeSchema }]),
    MongooseModule.forFeature([
      { name: 'HiringPlan', schema: HiringPlanSchema },
    ]),
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
  ],
})
export class DbModule {}
