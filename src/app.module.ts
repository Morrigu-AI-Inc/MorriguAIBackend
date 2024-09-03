import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { MessagesModule } from './messages/messages.module';
import { HttpModule } from '@nestjs/axios';
import { BedrockController } from './bedrock/bedrock.controller';
import { BedrockService } from './bedrock/bedrock.service';
import { BedrockModule } from './bedrock/bedrock.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DbModule } from './db/db.module';
import { PromptService } from './prompt/prompt.service';
import { PromptflagModule } from './promptflag/promptflag.module';
import { ApicredentialsModule } from './apicredentials/apicredentials.module';
import { ApikeysModule } from './apikeys/apikeys.module';
import { BillingModule } from './billing/billing.module';
import { EnvironmentModule } from './environment/environment.module';
import { InferenceparametersModule } from './inferenceparameters/inferenceparameters.module';
import { ModelModule } from './model/model.module';
import { ModelformattingModule } from './modelformatting/modelformatting.module';
import { OrganizationModule } from './organization/organization.module';
import { ProjectModule } from './project/project.module';
import { PromptversionModule } from './promptversion/promptversion.module';
import { QueryModule } from './query/query.module';
import { QueryresponseModule } from './queryresponse/queryresponse.module';
import { UserModule } from './user/user.module';
import { QueryresponsepairsModule } from './queryresponsepairs/queryresponsepairs.module';
import { IntegrationsettingsModule } from './inferencesettings/integrationsettings.module';
import { PromptModule } from './prompt/prompt.module';
import { ModelformattingService } from './modelformatting/modelformatting.service';
import { PrompthistoryModule } from './prompthistory/prompthistory.module';
import { ActionsModule } from './actions/actions.module';
import { ActionsService } from './actions/actions.service';
import { Xml2JsonServiceService } from './xml2-json-service/xml2-json-service.service';
import { FunctionCallsController } from './function-calls/function-calls.controller';
import { FunctionCallsModule } from './function-calls/function-calls.module';
import { StockInfoService } from './stock-info/stock-info.service';
import { StockInfoModule } from './stock-info/stock-info.module';
import { FunctionCallsService } from './function-calls/function-calls.service';
import { ToolsModule } from './tools/tools.module';
import { PersonasModule } from './personas/personas.module';
import { ToolsService } from './tools/tools.service';
import { SearchService } from './tools/search/search.service';
import { BuildPromptService } from './tools/build_prompt/build_prompt.service';
import { PrompthistoryService } from './prompthistory/prompthistory.service';
import { PromptHistorySchema } from './db/schemas/PromptHistory';
import { QuerySchema } from './db/schemas/Query';
import { QueryResponseSchema } from './db/schemas/QueryResponse';
import { QueryResponsePairSchema } from './db/schemas/QueryResponsePair';
import { ListingModule } from './listing/listing.module';
import { ListingService } from './listing/listing.service';
import { ListingController } from './listing/listing.controller';
import { MediaModule } from './media/media.module';
import { MediaService } from './media/media.service';
import { MediaSchema } from './db/schemas/Media';
import { ToolsController } from './tools/tools.controller';
import { AnthropicModule } from './anthropic/anthropic.module';
import { AnthropicService } from './anthropic/anthropic.service';
import { OpenaiModule } from './openai/openai.module';
import { SlackModule } from './slack/slack.module';
import { ExternalSlackMappingSchema } from './db/schemas/ExternalSlackMapping';
import { ToolOutputSchema } from './db/schemas/ToolOutput';
import { AssistantModule } from './assistant/assistant.module';
import { OrganizationSchema } from './db/schemas/Organization';
import { OrganizationService } from './organization/organization.service';
import { UserSchema } from './db/schemas/User';
import { StripeModule } from './stripe/stripe.module';
import { ProxyModule } from './proxy/proxy.module';
import { HiringPlanModule } from './hiring-plan/hiring-plan.module';
import { OperatingModelModule } from './operating-model/operating-model.module';
import { RevenueModelModule } from './revenue-model/revenue-model.module';
import { DemandGenerationModule } from './demand-generation/demand-generation.module';
import { SalesVolumeModule } from './sales-volume/sales-volume.module';
import { SalesVolumnService } from './sales-volumn/sales-volumn.service';
import { BbsubsModule } from './bbsubs/bbsubs.module';
import { TestModule } from './test/test.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { ExpenseModule } from './expense/expense.module';
import { VendorModule } from './vendor/vendor.module';
import { RolesModule } from './roles/roles.module';
import { AccountsModule } from './accounts/accounts.module';
import { StripeAccountModule } from './stripe_account/stripe_account.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { DepartmentModule } from './department/department.module';
import { EmployeeModule } from './employee/employee.module';
import { DecryptMiddleware } from './auth/decrypt.middleware';
import { EmployeeController } from './employee/employee.controller';
import { TeamModule } from './team/team.module';
import { AclModule } from './acl/acl.module';
import { OrganizationaclsModule } from './organizationacls/organizationacls.module';
import { UseraclsModule } from './useracls/useracls.module';
import { ResourceSimilarityAnalysisModule } from './tools/resource_similarity_analysis/resource_similarity_analysis.module';
import { InventoryModule } from './inventory/inventory.module';
import { RawmaterialModule } from './rawmaterial/rawmaterial.module';
import { PurchasingModule } from './purchasing/purchasing.module';
import { ShipmentModule } from './shipment/shipment.module';
import { SupplierModule } from './supplier/supplier.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { VectorStoreModule } from './vector-store/vector-store.module';
import { GenerativeModule } from './generative/generative.module';
import { ProductModule } from './product/product.module';
import { LineitemModule } from './lineitem/lineitem.module';
import { LangchainModule } from './langchain/langchain.module';
import { V1Module } from './v1/v1.module';
import { ApiKeyMiddleware } from './apikeys/apikeys.middleware';
import { AddressModule } from './address/address.module';
import { FsisModule } from './fsis/fsis.module';
import { UsdaDataModule } from './usda_data/usda_data.module';
import { NassModule } from './nass/nass.module';
import { FasModule } from './fas/fas.module';
import { NotificationModule } from './notification/notification.module';
import { ObjectmatcherModule } from './objectmatcher/objectmatcher.module';
import { ImportyetiModule } from './importyeti/importyeti.module';
import { AisModule } from './ais/ais.module';
import { AmazonModule } from './punchouts/amazon/amazon.module';
import { EncryptionService } from './encryption/encryption.service';
import { WorkflowModule } from './workflow/workflow.module';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature([
      { name: 'PromptHistory', schema: PromptHistorySchema },
    ]),
    MongooseModule.forFeature([{ name: 'Query', schema: QuerySchema }]),
    MongooseModule.forFeature([
      { name: 'QueryResponse', schema: QueryResponseSchema },
    ]),
    MongooseModule.forFeature([
      { name: 'QueryResponsePair', schema: QueryResponsePairSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Media', schema: MediaSchema }]),
    MongooseModule.forFeature([
      { name: 'ExternalSlackMapping', schema: ExternalSlackMappingSchema },
    ]),
    MongooseModule.forFeature([
      { name: 'ToolOutput', schema: ToolOutputSchema },
    ]),
    MongooseModule.forFeature([
      { name: 'Organization', schema: OrganizationSchema },
    ]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MessagesModule,
    HttpModule,

    BedrockModule,

    DbModule,

    PromptflagModule,

    AclModule,

    ApicredentialsModule,

    ApikeysModule,

    BillingModule,

    EnvironmentModule,

    InferenceparametersModule,

    IntegrationsettingsModule,

    ModelModule,

    ModelformattingModule,

    OrganizationModule,

    ProjectModule,

    PromptversionModule,

    QueryModule,

    QueryresponseModule,

    UserModule,

    QueryresponsepairsModule,

    PromptModule,

    PrompthistoryModule,

    ActionsModule,

    FunctionCallsModule,

    StockInfoModule,

    ToolsModule,

    PersonasModule,

    ListingModule,

    MediaModule,

    AnthropicModule,

    OpenaiModule,

    SlackModule,

    AssistantModule,

    StripeModule,

    ProxyModule,

    HiringPlanModule,

    OperatingModelModule,

    RevenueModelModule,

    DemandGenerationModule,

    SalesVolumeModule,

    BbsubsModule,

    TestModule,

    SubscriptionsModule,

    ExpenseModule,

    VendorModule,

    RolesModule,

    AccountsModule,

    StripeAccountModule,

    OnboardingModule,

    DepartmentModule,

    EmployeeModule,

    TeamModule,

    OrganizationaclsModule,

    UseraclsModule,

    ResourceSimilarityAnalysisModule,

    InventoryModule,

    RawmaterialModule,

    PurchasingModule,

    ShipmentModule,

    SupplierModule,

    WarehouseModule,

    VectorStoreModule,

    GenerativeModule,

    ProductModule,

    LineitemModule,

    LangchainModule,

    V1Module,

    AddressModule,

    FsisModule,

    UsdaDataModule,

    NassModule,

    FasModule,

    NotificationModule,

    ObjectmatcherModule,

    ImportyetiModule,

    AisModule,

    AmazonModule,

    WorkflowModule,

    MailerModule,
  ],
  controllers: [
    AppController,
    AuthController,
    BedrockController,
    FunctionCallsController,
    ListingController,
    ToolsController,
  ],
  providers: [
    AppService,
    AuthService,
    BedrockService,
    PromptService,
    ActionsService,
    Xml2JsonServiceService,
    StockInfoService,
    FunctionCallsService,
    ToolsService,
    SearchService,
    BuildPromptService,
    PrompthistoryService,
    ListingService,
    MediaService,
    AnthropicService,
    OrganizationService,
    SalesVolumnService,
    EncryptionService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiKeyMiddleware).forRoutes('*'); // Apply to all routes
  }
}
