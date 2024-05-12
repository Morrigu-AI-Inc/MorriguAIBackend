import { Module } from '@nestjs/common';
import { BbsubsService } from './bbsubs.service';
import { DbModule } from 'src/db/db.module';
import { BbsubsController } from './bbsubs.controller';

@Module({
  providers: [BbsubsService],
  imports: [DbModule],
  controllers: [BbsubsController],
})
export class BbsubsModule {}
