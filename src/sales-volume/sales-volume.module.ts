import { Module } from '@nestjs/common';
import { SalesVolumeService } from './sales-volume.service';
import { SalesVolumeController } from './sales-volume.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  providers: [SalesVolumeService],
  controllers: [SalesVolumeController],
  imports: [DbModule],
})
export class SalesVolumeModule {}
