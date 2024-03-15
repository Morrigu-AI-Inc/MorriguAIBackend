import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IntegrationSettingsSchema } from 'src/db/schemas/IntegrationSettings';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'IntegrationSettings', schema: IntegrationSettingsSchema }
  ])],
})
export class IntegrationsettingsModule {}
