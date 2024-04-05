import { Module } from '@nestjs/common';
import { SearchPropertyController } from './search_property.controller';
import { ActionsService } from 'src/actions/actions.service';
import { Xml2JsonServiceService } from 'src/xml2-json-service/xml2-json-service.service';

@Module({
  providers: [ActionsService, Xml2JsonServiceService],
  controllers: [SearchPropertyController],
})
export class SearchPropertyModule {}
