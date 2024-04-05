import { Module } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { BaseService } from './base/base.service';
import { ModulesModule } from './modules/modules.module';

@Module({
  providers: [AgentsService, BaseService],
  exports: [AgentsService],
  imports: [ModulesModule],
})
export class AgentsModule {}
