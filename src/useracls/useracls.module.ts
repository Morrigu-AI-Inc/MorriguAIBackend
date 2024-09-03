import { Module } from '@nestjs/common';
import { UseraclsService } from './useracls.service';
import { UseraclsController } from './useracls.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [UseraclsController],
  providers: [UseraclsService],
  imports: [DbModule],
})
export class UseraclsModule {}
