import { Module } from '@nestjs/common';
import { SlackService } from './slack.service';
import { SlackController } from './slack.controller';
import { OpenaiService } from 'src/openai/openai.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ExternalSlackMappingSchema } from 'src/db/schemas/ExternalSlackMapping';
import { ToolOutputSchema } from 'src/db/schemas/ToolOutput';
import { AssistantService } from 'src/assistant/assistant.service';
import { OrganizationService } from 'src/organization/organization.service';
import { OrganizationSchema } from 'src/db/schemas/Organization';
import { UserSchema } from 'src/db/schemas/User';
import { KnowledgeBaseSchema } from 'src/db/schemas/KnowledgeBase';
import { AgentSchema } from 'src/db/schemas/Agent';

@Module({
  providers: [
    SlackService,
    OpenaiService,
    AssistantService,
    OrganizationService,
  ],
  controllers: [SlackController],
  imports: [
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
    MongooseModule.forFeature([
      { name: 'KnowledgeBase', schema: KnowledgeBaseSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Agent', schema: AgentSchema }]),
  ],
})
export class SlackModule {}
