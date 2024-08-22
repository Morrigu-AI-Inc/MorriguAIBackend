import { Module } from '@nestjs/common';
import { AisService } from './ais.service';
import { AisController } from './ais.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [AisController],
  providers: [AisService],
  imports: [DbModule]
})
export class AisModule {}
