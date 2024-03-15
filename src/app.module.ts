import { Module } from '@nestjs/common';
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
import { AclModule } from './acl/acl.module';
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

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
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
  ],
  controllers: [AppController, AuthController, BedrockController],
  providers: [
    AppService,
    AuthService,
    BedrockService,
    PromptService,

  ],
})
export class AppModule {}
