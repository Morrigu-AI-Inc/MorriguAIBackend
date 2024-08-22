import { Module } from '@nestjs/common';
import { ObjectmatcherService } from './objectmatcher.service';
import { ObjectmatcherController } from './objectmatcher.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [ObjectmatcherController],
  providers: [ObjectmatcherService],
  imports: [DbModule],
})
export class ObjectmatcherModule {}
