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
import { GroupSchema, RootOrgGroupSchema, TeamSchema } from './schemas/Team';
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
import DepartmentSchema from './schemas/Department';
import { ToolDescriptionSchema } from './schemas/Tools';
import { ToolInputSchema } from './schemas/ToolInput';
import WarehouseSchema from './schemas/Warehouse';
import SupplierSchema from './schemas/Supplier';
import ShipmentSchema from './schemas/Shipment';
import RawMaterialSchema from './schemas/RawMaterial';
import InventorySchema from './schemas/Inventory';
import PurchaseOrderSchema from './schemas/PurchaseOrder';
import ProductSchema from './schemas/Product';
import {
  AgentSchema,
  AssistantSchema,
  BillingPlanSchema,
  BillingSchema,
  KnowledgeBaseSchema,
  ToolOutputSchema,
} from './schemas';
import VectorStoreSchema from './schemas/VectorStore';
import ThreadSchema from './schemas/Thread';
import MessageSchema from './schemas/Message';
import AttachmentSchema from './schemas/Attachment';
import { LineItemSchema } from './schemas/LineItem';
import RunSchema from './schemas/Run';
import StepSchema, { modules } from './schemas/Step';
import { messageDeltaModules } from './schemas/ThreadMessageDelta';
import StepDeltaSchema from './schemas/StepDelta';
import ThreadMessageSchema from './schemas/ThreadMessage';
import { FSISMPIEstablishmentSchema } from './schemas/FSISMPIEstablishment';
import { FSISEstDemographicSchema } from './schemas/FSISEstDemographic';
import { BrandedFoodSchema } from './schemas/BrandedFood';
import { FoodDataSchema } from './schemas/FoodData';
import USDAReportSchema from './schemas/USDAReport';
import { BatchSchema } from './schemas/Batch';
import { schemas as USDASchemas } from './schemas/GATSSchemas';
import {
  RegionSchema,
  CountrySchema,
  CommoditySchema,
  UnitOfMeasureSchema,
  DataReleaseDatesSchema,
  ExportSalesSchema,
} from './schemas/ExportSales';
import { IngestionJobSchema } from './schemas/IngestionJob';
import {
  IndividualNotificationSchema,
  NotificationSchema,
  OrganizationNotificationSchema,
  SystemNotificationSchema,
} from './schemas/Notification';
import { CronJobSchema } from './schemas/CronJob';
import { ObjectWatcherSchema } from './schemas/ObjectWatcher';
import { ImportYetiShipmentSchema } from './schemas/ImportYeti';
import { VesselSchema } from './schemas/AIS';
import { InvitationSchema } from './schemas/Invitation';

const schemas = [
  MongooseModule.forFeature([{ name: 'Account', schema: AccountSchema }]),
  MongooseModule.forFeature([{ name: 'Address', schema: AddressSchema }]),
  MongooseModule.forFeature([
    { name: 'BBSubsDataPoint', schema: BBSubsDataPointSchema },
  ]),
  MongooseModule.forFeature([
    { name: 'BillingItem', schema: BillingItemSchema },
  ]),
  MongooseModule.forFeature([
    { name: 'BillingPlan', schema: BillingPlanSchema },
  ]),
  MongooseModule.forFeature([{ name: 'Billing', schema: BillingSchema }]),
  MongooseModule.forFeature([
    { name: 'ChatMessage', schema: ChatMessageSchema },
  ]),
  MongooseModule.forFeature([{ name: 'Customer', schema: CustomerSchema }]),
  MongooseModule.forFeature([{ name: 'DatumEntry', schema: DatumEntrySchema }]),
  MongooseModule.forFeature([{ name: 'Department', schema: DepartmentSchema }]),
  MongooseModule.forFeature([{ name: 'Employee', schema: EmployeeSchema }]),
  MongooseModule.forFeature([{ name: 'Expense', schema: ExpenseSchema }]),
  MongooseModule.forFeature([
    { name: 'ExpenseCategory', schema: ExpenseCategorySchema },
  ]),
  MongooseModule.forFeature([
    { name: 'FinancialCategory', schema: FinancialCategorySchema },
  ]),
  MongooseModule.forFeature([{ name: 'HiringPlan', schema: HiringPlanSchema }]),
  MongooseModule.forFeature([{ name: 'History', schema: HistorySchema }]),
  MongooseModule.forFeature([{ name: 'Inventory', schema: InventorySchema }]),
  MongooseModule.forFeature([{ name: 'Lead', schema: LeadSchema }]),
  MongooseModule.forFeature([{ name: 'Media', schema: MediaSchema }]),
  MongooseModule.forFeature([{ name: 'Model', schema: ModelSchema }]),
  MongooseModule.forFeature([
    { name: 'ModelFormatting', schema: ModelFormattingSchema },
  ]),
  MongooseModule.forFeature([
    { name: 'MonthlyFinancialDetail', schema: MonthlyFinancialDetailSchema },
  ]),
  MongooseModule.forFeature([
    { name: 'OperatingModel', schema: OperatingModelSchema },
  ]),
  MongooseModule.forFeature([
    { name: 'Organization', schema: OrganizationSchema },
  ]),
  MongooseModule.forFeature([
    { name: 'OrganizationACL', schema: OrganizationACLSchema },
  ]),
  MongooseModule.forFeature([{ name: 'Prompt', schema: PromptSchema }]),
  MongooseModule.forFeature([{ name: 'PromptFlag', schema: PromptFlagSchema }]),
  MongooseModule.forFeature([
    { name: 'PromptHistory', schema: PromptHistorySchema },
  ]),
  MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
  MongooseModule.forFeature([
    { name: 'PurchaseOrder', schema: PurchaseOrderSchema },
  ]),
  MongooseModule.forFeature([
    { name: 'QueryResponse', schema: QueryResponseSchema },
  ]),
  MongooseModule.forFeature([
    { name: 'QueryResponsePair', schema: QueryResponsePairSchema },
  ]),
  MongooseModule.forFeature([
    { name: 'RawMaterial', schema: RawMaterialSchema },
  ]),
  MongooseModule.forFeature([
    { name: 'ResourceForecast', schema: ResourceForecastSchema },
  ]),
  MongooseModule.forFeature([
    { name: 'ResourceItem', schema: ResourceItemSchema },
  ]),
  MongooseModule.forFeature([
    { name: 'RevenueData', schema: RevenueDataSchema },
  ]),
  MongooseModule.forFeature([
    { name: 'RevenueModel', schema: RevenueModelSchema },
  ]),
  MongooseModule.forFeature([{ name: 'Role', schema: RoleSchema }]),
  MongooseModule.forFeature([
    { name: 'SalesVolume', schema: SalesVolumeSchema },
  ]),
  MongooseModule.forFeature([{ name: 'Shipment', schema: ShipmentSchema }]),
  MongooseModule.forFeature([
    { name: 'StripeAccount', schema: StripeAccountSchema },
  ]),
  MongooseModule.forFeature([
    { name: 'Subscription', schema: SubscriptionSchema },
  ]),
  MongooseModule.forFeature([{ name: 'Supplier', schema: SupplierSchema }]),
  MongooseModule.forFeature([{ name: 'Team', schema: TeamSchema }]),
  MongooseModule.forFeature([
    { name: 'ToolDescription', schema: ToolDescriptionSchema },
  ]),
  MongooseModule.forFeature([{ name: 'ToolInput', schema: ToolInputSchema }]),
  MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  MongooseModule.forFeature([{ name: 'UserACL', schema: UserACLSchema }]),
  MongooseModule.forFeature([{ name: 'Vendor', schema: VendorSchema }]),
  MongooseModule.forFeature([{ name: 'Warehouse', schema: WarehouseSchema }]),
  MongooseModule.forFeature([{ name: 'Tier', schema: TierSchema }]),
  MongooseModule.forFeature([
    { name: 'VectorStore', schema: VectorStoreSchema },
  ]),
  MongooseModule.forFeature([{ name: 'Assistant', schema: AssistantSchema }]),
  MongooseModule.forFeature([{ name: 'ToolOutput', schema: ToolOutputSchema }]),
  MongooseModule.forFeature([
    { name: 'KnowledgeBase', schema: KnowledgeBaseSchema },
  ]),
  MongooseModule.forFeature([{ name: 'Agent', schema: AgentSchema }]),
  MongooseModule.forFeature([{ name: 'Thread', schema: ThreadSchema }]),
  MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
  MongooseModule.forFeature([{ name: 'Attachment', schema: AttachmentSchema }]),
  MongooseModule.forFeature([{ name: 'LineItem', schema: LineItemSchema }]),
  MongooseModule.forFeature([{ name: 'Run', schema: RunSchema }]),
  MongooseModule.forFeature([{ name: 'StepDelta', schema: StepDeltaSchema }]),
  MongooseModule.forFeature([
    { name: 'ThreadMessage', schema: ThreadMessageSchema },
  ]),
  // OpenAI
  ...modules,
  ...messageDeltaModules,

  MongooseModule.forFeature([
    { name: 'FSISMPIEstablishment', schema: FSISMPIEstablishmentSchema },
  ]),
  MongooseModule.forFeature([
    { name: 'FSISEstDemographic', schema: FSISEstDemographicSchema },
  ]),
  MongooseModule.forFeature([
    { name: 'BrandedFood', schema: BrandedFoodSchema },
  ]),
  MongooseModule.forFeature([{ name: 'FoodData', schema: FoodDataSchema }]),
  MongooseModule.forFeature([{ name: 'USDAReport', schema: USDAReportSchema }]),
  MongooseModule.forFeature([{ name: 'Batch', schema: BatchSchema }]),
  MongooseModule.forFeature([
    { name: 'Region', schema: RegionSchema },
    { name: 'Country', schema: CountrySchema },
    { name: 'Commodity', schema: CommoditySchema },
    { name: 'UnitOfMeasure', schema: UnitOfMeasureSchema },
    { name: 'DataReleaseDates', schema: DataReleaseDatesSchema },
    { name: 'ExportSales', schema: ExportSalesSchema },
    {
      name: 'CensusDataReleaseExports',
      schema: USDASchemas.CensusDataReleaseExports,
    },
    {
      name: 'CensusDataReleaseImports',
      schema: USDASchemas.CensusDataReleaseImports,
    },
    { name: 'GATSRegion', schema: USDASchemas.GATSRegion },
    { name: 'GATSCountry', schema: USDASchemas.GATSCountry },
    { name: 'GATSCommodity', schema: USDASchemas.GATSCommodity },
    { name: 'HS6Commodity', schema: USDASchemas.HS6Commodity },
    { name: 'GATSUnitOfMeasure', schema: USDASchemas.GATSUnitOfMeasure },
    { name: 'GATSCustomsDistrict', schema: USDASchemas.GATSCustomsDistrict },
    { name: 'GATSCensusImports', schema: USDASchemas.GATSCensusImports },
    { name: 'GATSCensusReExports', schema: USDASchemas.GATSCensusReExports },
    {
      name: 'GATSCustomDistrictExport',
      schema: USDASchemas.GATSCustomDistrictExport,
    },
    {
      name: 'GATSCustomDistrictImport',
      schema: USDASchemas.GATSCustomDistrictImport,
    },
    {
      name: 'GATSCustomDistrictReExport',
      schema: USDASchemas.GATSCustomDistrictReExport,
    },
    { name: 'GATSUNTradeImport', schema: USDASchemas.GATSUNTradeImport },
    { name: 'GATSUNTradeExport', schema: USDASchemas.GATSUNTradeExport },
    { name: 'GATSUNTradeReExport', schema: USDASchemas.GATSUNTradeReExport },
    { name: 'PSDCommodity', schema: USDASchemas.PSDCommodity },
    { name: 'PSDDataRelease', schema: USDASchemas.PSDDataRelease },
    { name: 'PSDRecord', schema: USDASchemas.PSDRecord },
    { name: 'PSDRegion', schema: USDASchemas.PSDRegion },
    { name: 'PSDCountry', schema: USDASchemas.PSDCountry },
    { name: 'PSDUnitOfMeasure', schema: USDASchemas.PSDUnitOfMeasure },
    { name: 'PSDAttribute', schema: USDASchemas.PSDAttribute },
    { name: 'IngestionJob', schema: IngestionJobSchema },

    { name: 'Notification', schema: NotificationSchema },
    { name: 'SystemNotification', schema: SystemNotificationSchema },
    { name: 'IndividualNotification', schema: IndividualNotificationSchema },
    {
      name: 'OrganizationNotification',
      schema: OrganizationNotificationSchema,
    },
    { name: 'CronJob', schema: CronJobSchema },
    { name: 'ObjectWatcher', schema: ObjectWatcherSchema },
    { name: 'ImportYetiShipment', schema: ImportYetiShipmentSchema },

    { name: 'Vessel', schema: VesselSchema },
    { name: 'Group', schema: GroupSchema },
    { name: 'RootOrgGroup', schema: RootOrgGroupSchema },
    { name: 'Invitation', schema: InvitationSchema },
  ]),
];

@Module({
  imports: schemas,
  exports: schemas,
})
export class DbModule {}
