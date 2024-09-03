import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { DbModule } from 'src/db/db.module';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  controllers: [TeamController],
  providers: [TeamService, MailerService],
  imports:[DbModule]
})
export class TeamModule {}
