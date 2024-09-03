import { Module } from '@nestjs/common';
import { PurchasingService } from './purchasing.service';
import { PurchasingController } from './purchasing.controller';
import { DbModule } from 'src/db/db.module';
import { TeamService } from 'src/team/team.service';
import { MailerService } from 'src/mailer/mailer.service';
import { QueueService } from 'src/queue/queue.service';
import { QueueModule } from 'src/queue/queue.module';
import { AmazonModule } from 'src/punchouts/amazon/amazon.module';

@Module({
  controllers: [PurchasingController],
  providers: [PurchasingService, TeamService, MailerService, QueueService],
  imports: [DbModule, QueueModule, AmazonModule],  
})
export class PurchasingModule {}
