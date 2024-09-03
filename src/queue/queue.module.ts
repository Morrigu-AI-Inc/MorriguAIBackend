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

@Module({
  imports: [
    BullModule.registerQueue({
      name: BullQueues.RIGU_QUEUE,
    }),
    DbModule
  ],
  controllers: [QueueController],
  providers: [QueueService, RiguQConsumer, PurchasingService, TeamService, MailerService, ],
  exports: [QueueService, BullModule.registerQueue({
    name: BullQueues.RIGU_QUEUE,
  })]
})
export class QueueModule {}
