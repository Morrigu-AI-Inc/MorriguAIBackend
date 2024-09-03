import { Module } from '@nestjs/common';
import { AmazonService } from './amazon.service';
import { AmazonController } from './amazon.controller';
import { DbModule } from 'src/db/db.module';
import { EncryptionService } from 'src/encryption/encryption.service';
import { PurchasingService } from 'src/purchasing/purchasing.service';
import { TeamService } from 'src/team/team.service';
import { MailerService } from 'src/mailer/mailer.service';
import { QueueService } from 'src/queue/queue.service';
import { BullModule } from '@nestjs/bull';
import { BullQueues } from 'src/queue/entities/queue.entity';

@Module({
  controllers: [AmazonController],
  providers: [AmazonService, EncryptionService, PurchasingService, TeamService, MailerService, QueueService],
  imports: [DbModule,BullModule.registerQueue({
    name: BullQueues.RIGU_QUEUE,
  })]
})
export class AmazonModule {}
