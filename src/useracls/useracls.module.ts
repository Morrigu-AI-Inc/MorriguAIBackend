import { Module } from '@nestjs/common';
import { UseraclsService } from './useracls.service';
import { UseraclsController } from './useracls.controller';

@Module({
  controllers: [UseraclsController],
  providers: [UseraclsService],
})
export class UseraclsModule {}
