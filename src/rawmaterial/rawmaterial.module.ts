import { Module } from '@nestjs/common';
import { RawmaterialService } from './rawmaterial.service';
import { RawmaterialController } from './rawmaterial.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [RawmaterialController],
  providers: [RawmaterialService],
  imports: [DbModule],
})
export class RawmaterialModule {}
