import { Module } from '@nestjs/common';
import { NassService } from './nass.service';
import { NassController } from './nass.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [NassController],
  providers: [NassService],
  imports: [DbModule]
})
export class NassModule {}
