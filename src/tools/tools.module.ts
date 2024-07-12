import { Module } from '@nestjs/common';
import { ToolsService } from './tools.service';
import { SearchService } from './search/search.service';
import { WebscraperService } from './webscraper/webscraper.service';
import { WebSearchService } from './web_search/web-search.service';
import { ToolsController } from './tools.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ToolDescriptionSchema } from 'src/db/schemas/Tools';
import { SearchForMoreToolsController } from './search_for_more_tools/search_for_more_tools.controller';
import { SearchForMoreToolsService } from './search_for_more_tools/search_for_more_tools.service';
import { WebSearchController } from './web_search/web_search.controller';
import { WebSearchModule } from './web_search/web_search.module';
import { ActionsService } from 'src/actions/actions.service';
import { Xml2JsonServiceService } from 'src/xml2-json-service/xml2-json-service.service';
import { SearchPropertyModule } from './search_property/search_property.module';
import { GetWeatherController } from './get_weather/get_weather.controller';
import { GetToolDescriptionController } from './get_tool_description/get_tool_description.controller';
import { GetToolDescriptionModule } from './get_tool_description/get_tool_description.module';
import { BuildPromptModule } from './build_prompt/build_prompt.module';
import { SubmitSellerContactInformationController } from './submit_seller_contact_information/submit_seller_contact_information.controller';
import { SubmitSellerContactInformationModule } from './submit_seller_contact_information/submit_seller_contact_information.module';
import { CreateListingModule } from './create_listing/create_listing.module';
import { FetchListingModule } from './fetch_listing/fetch_listing.module';
import { SubmitAssessmentModule } from './submit_assessment/submit_assessment.module';
import { FetchHubspotCompaniesModule } from './fetch_hubspot_companies/fetch_hubspot_companie.module';
import { GetHubspotCompanyModule } from './get_hubspot_company/get_hubspot_company.module';
import { GetSalesforceObjectsListModule } from './get_salesforce_objects_list/get_salesforce_objects_list.module';
import { PandadocListDocumentsController } from './pandadoc_list_documents/pandadoc_list_documents.controller';
import { PandadocGetDocumentStatusController } from './pandadoc_get_document_status/pandadoc_get_document_status.controller';
import { PandadocGetDocumentDetailsController } from './pandadoc_get_document_details/pandadoc_get_document_details.controller';
import { PandadocGetDocumentSectionsController } from './pandadoc_get_document_sections/pandadoc_get_document_sections.controller';
import { GetUserTasksController } from './get_user_tasks/get_user_tasks.controller';
import { SearchNotionController } from './search_notion/search_notion.controller';
import { GetNotionPageController } from './get_notion_page/get_notion_page.controller';
import { GetNotionDatabaseController } from './get_notion_database/get_notion_database.controller';
import { GetNotionPagePropertyController } from './get_notion_page_property/get_notion_page_property.controller';
import { GetNotionBlockController } from './get_notion_block/get_notion_block.controller';
import { GetNotionBlockChildrenController } from './get_notion_block_children/get_notion_block_children.controller';
import { GetNotionCommentsController } from './get_notion_comments/get_notion_comments.controller';
import { ShopifyGetCustomersController } from './shopify_get_customers/shopify_get_customers.controller';
import { QuickbooksQueryCustomersController } from './quickbooks_query_customers/quickbooks_query_customers.controller';
import { UpdateQuickbooksCustomerController } from './update_quickbooks_customer/update_quickbooks_customer.controller';
import { SalesforceMetadataSobjectFetcherController } from './salesforce_metadata_sobject_fetcher/salesforce_metadata_sobject_fetcher.controller';
import { QuickbooksQueryController } from './quickbooks_query/quickbooks_query.controller';
import { SalesforceQueryModule } from './salesforce_query/salesforce_query.module';
import { CreateInvoiceModule } from './create_invoice/create_invoice.module';
import { QuickbooksUpdateModule } from './quickbooks_update/quickbooks_update.module';
import { GithubApiIntegrationModule } from './github_api_integration/github_api_integration.module';
import { ZendeskSupportIntegrationModule } from './zendesk_support_integration/zendesk_support_integration.module';
import { SlackApiIntegrationModule } from './slack_api_integration/slack_api_integration.module';
import { HubspotApiIntegrationModule } from './hubspot_api_integration/hubspot_api_integration.module';
import { NotionApiIntegrationModule } from './notion_api_integration/notion_api_integration.module';
import { ToolSearchModule } from './tool_search/tool_search.module';
import { SalesforceApiIntegrationModule } from './salesforce_api_integration/salesforce_api_integration.module';
import { QuickbooksApiIntegrationModule } from './quickbooks_api_integration/quickbooks_api_integration.module';
import { FinancialDataPointCommitModule } from './financial_data_point_commit/financial_data_point_commit.module';
import { ChangeAssistantToolModule } from './change_assistant_tool/change_assistant_tool.module';
import { Co2ImpactController } from './co2_impact/co2_impact.controller';
import { CreatePurchaseOrderModule } from './create_purchase_order/create_purchase_order.module';
import { ProductEntryModule } from './product_entry/product_entry.module';
import { QuickbooksModule } from './quickbooks/quickbooks.module';
import { NotepadModule } from './notepad/notepad.module';
import { FsisMpiSearchModule } from './fsis_mpi_search/fsis_mpi_search.module';

@Module({
  providers: [
    ToolsService,
    SearchService,
    WebscraperService,
    WebSearchService,
    SearchForMoreToolsService,
    ActionsService,
    Xml2JsonServiceService,
  ],
  controllers: [
    ToolsController,
    SearchForMoreToolsController,
    WebSearchController,
    GetWeatherController,
    GetToolDescriptionController,
    SubmitSellerContactInformationController,
    PandadocListDocumentsController,
    PandadocGetDocumentStatusController,
    PandadocGetDocumentDetailsController,
    PandadocGetDocumentSectionsController,
    GetUserTasksController,
    SearchNotionController,
    GetNotionPageController,
    GetNotionDatabaseController,
    GetNotionPagePropertyController,
    GetNotionBlockController,
    GetNotionBlockChildrenController,
    GetNotionCommentsController,
    ShopifyGetCustomersController,
    QuickbooksQueryCustomersController,
    UpdateQuickbooksCustomerController,
    SalesforceMetadataSobjectFetcherController,
    QuickbooksQueryController,
    Co2ImpactController,
  ],
  imports: [
    MongooseModule.forFeature([
      { name: 'ToolDescription', schema: ToolDescriptionSchema },
    ]),
    WebSearchModule,
    SearchPropertyModule,
    GetToolDescriptionModule,
    BuildPromptModule,
    SubmitSellerContactInformationModule,
    CreateListingModule,
    FetchListingModule,
    SubmitAssessmentModule,
    FetchHubspotCompaniesModule,
    GetHubspotCompanyModule,
    GetSalesforceObjectsListModule,
    SalesforceQueryModule,
    CreateInvoiceModule,
    QuickbooksUpdateModule,
    GithubApiIntegrationModule,
    ZendeskSupportIntegrationModule,
    SlackApiIntegrationModule,
    HubspotApiIntegrationModule,
    NotionApiIntegrationModule,
    ToolSearchModule,
    SalesforceApiIntegrationModule,
    QuickbooksApiIntegrationModule,
    FinancialDataPointCommitModule,
    ChangeAssistantToolModule,
    CreatePurchaseOrderModule,
    ProductEntryModule,
    QuickbooksModule,
    NotepadModule,
    FsisMpiSearchModule,
  ],
  exports: [
    
  ],
})
export class ToolsModule {}
