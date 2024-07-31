import { Module } from '@nestjs/common';
import { UsdaDataService } from './usda_data.service';
import { UsdaDataController } from './usda_data.controller';
import { DbModule } from 'src/db/db.module';
import { OpenaiService } from 'src/openai/openai.service';
import { AssistantService } from 'src/assistant/assistant.service';
import { OrganizationService } from 'src/organization/organization.service';

@Module({
  controllers: [UsdaDataController],
  providers: [UsdaDataService, OpenaiService, AssistantService, OrganizationService],
  imports: [DbModule],
})
export class UsdaDataModule {}
