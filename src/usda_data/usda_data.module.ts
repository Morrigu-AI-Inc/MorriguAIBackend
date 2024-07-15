import { Module } from '@nestjs/common';
import { UsdaDataService } from './usda_data.service';
import { UsdaDataController } from './usda_data.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [UsdaDataController],
  providers: [UsdaDataService],
  imports: [DbModule],
})
export class UsdaDataModule {}
