import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { RiguQConsumer } from './consumers/rigu-q.consumer';
import { BullModule } from '@nestjs/bull';
import { BullQueues } from './entities/queue.entity';
import { PurchasingService } from 'src/purchasing/purchasing.service';
import { DbModule } from 'src/db/db.module';
import { TeamService } from 'src/team/team.service';
import { MailerService } from 'src/mailer/mailer.service';
import { OpenaiModule } from 'src/openai/openai.module';
import { AssistantModule } from 'src/assistant/assistant.module';
import { OpenaiService } from 'src/openai/openai.service';
import { AssistantService } from 'src/assistant/assistant.service';
import { OrganizationService } from 'src/organization/organization.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: BullQueues.RIGU_QUEUE,
    }),
    DbModule,
    OpenaiModule,
    AssistantModule,
  ],
  controllers: [QueueController],
  providers: [RiguQConsumer, PurchasingService, TeamService, MailerService, QueueService, OpenaiService, AssistantService, OrganizationService],
  exports: [
    BullModule.registerQueue({
      name: BullQueues.RIGU_QUEUE,
    }),
  ],
})
export class QueueModule {}