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
import { SummarizeTextModule } from './summarize_text/summarize_text.module';
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
    SummarizeTextModule,
    SubmitAssessmentModule,
    FetchHubspotCompaniesModule,
    GetHubspotCompanyModule,
    GetSalesforceObjectsListModule,
  ],
  exports: [
    MongooseModule.forFeature([
      { name: 'ToolDescription', schema: ToolDescriptionSchema },
    ]),
  ],
})
export class ToolsModule {}
