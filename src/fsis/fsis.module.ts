import { Module } from '@nestjs/common';
import { FsisService } from './fsis.service';
import { FsisController } from './fsis.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [FsisController],
  providers: [FsisService],
  imports: [DbModule]
})
export class FsisModule {}
