import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationSchema } from 'src/db/schemas/Organization';
import { OrganizationService } from './organization.service';
import { UserSchema } from 'src/db/schemas/User';
import { OrganizationController } from './organization.controller';
import { DbModule } from 'src/db/db.module';
import { AssistantService } from 'src/assistant/assistant.service';

@Module({
  imports: [DbModule],
  providers: [OrganizationService, AssistantService],
  controllers: [OrganizationController],
})
export class OrganizationModule {}
