import { Module } from '@nestjs/common';
import { LineitemService } from './lineitem.service';
import { LineitemController } from './lineitem.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [LineitemController],
  providers: [LineitemService],
  imports: [DbModule],
})
export class LineitemModule {}
