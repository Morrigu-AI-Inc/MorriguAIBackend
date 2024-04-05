import { Module } from '@nestjs/common';
import { ActionsController } from './actions.controller';
import { ActionsService } from './actions.service';
import { Xml2JsonServiceService } from 'src/xml2-json-service/xml2-json-service.service';

@Module({
  controllers: [ActionsController],
  providers: [ActionsService, Xml2JsonServiceService]
})
export class ActionsModule {}
