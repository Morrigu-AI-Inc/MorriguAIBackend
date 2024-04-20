import { Module } from '@nestjs/common';
import { OpenaiController } from './openai.controller';
import { OpenaiService } from './openai.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ToolOutputSchema } from 'src/db/schemas/ToolOutput';
import { AssistantService } from 'src/assistant/assistant.service';
import { OrganizationService } from 'src/organization/organization.service';
import { OrganizationSchema } from 'src/db/schemas/Organization';
import { UserSchema } from 'src/db/schemas/User';

@Module({
  controllers: [OpenaiController],
  providers: [OpenaiService, AssistantService, OrganizationService],
  imports: [
    MongooseModule.forFeature([
      { name: 'ToolOutput', schema: ToolOutputSchema },
    ]),
    MongooseModule.forFeature([
      { name: 'Organization', schema: OrganizationSchema },
    ]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
})
export class OpenaiModule {}
