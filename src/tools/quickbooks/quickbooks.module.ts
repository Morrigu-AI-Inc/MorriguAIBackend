import { Module } from '@nestjs/common';
import { QuickbooksService } from './quickbooks.service';
import { QuickbooksController } from './quickbooks.controller';
import { ToolsService } from '../tools.service';
import { DbModule } from 'src/db/db.module';
import { Xml2JsonServiceService } from 'src/xml2-json-service/xml2-json-service.service';

@Module({
  controllers: [QuickbooksController],
  providers: [QuickbooksService, ToolsService, Xml2JsonServiceService],
  imports: [DbModule],
})
export class QuickbooksModule {}
