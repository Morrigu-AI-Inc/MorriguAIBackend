import { Module } from '@nestjs/common';
import { OpenaiController } from './openai.controller';
import { OpenaiService } from './openai.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ToolOutputSchema } from 'src/db/schemas/ToolOutput';
import { AssistantService } from 'src/assistant/assistant.service';
import { OrganizationService } from 'src/organization/organization.service';
import { OrganizationSchema } from 'src/db/schemas/Organization';
import { UserSchema } from 'src/db/schemas/User';
import { MediaService } from 'src/media/media.service';
import { MediaSchema } from 'src/db/schemas/Media';
import { KnowledgeBaseSchema } from 'src/db/schemas/KnowledgeBase';
import { DbModule } from 'src/db/db.module';
import { AgentSchema } from 'src/db/schemas/Agent';

@Module({
  controllers: [OpenaiController],
  providers: [
    OpenaiService,
    AssistantService,
    OrganizationService,
    MediaService,
  ],
  imports: [
    MongooseModule.forFeature([
      { name: 'ToolOutput', schema: ToolOutputSchema },
    ]),
    MongooseModule.forFeature([
      { name: 'Organization', schema: OrganizationSchema },
    ]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Media', schema: MediaSchema }]),
    MongooseModule.forFeature([
      { name: 'KnowledgeBase', schema: KnowledgeBaseSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Agent', schema: AgentSchema }]),
  ],
})
export class OpenaiModule {}
