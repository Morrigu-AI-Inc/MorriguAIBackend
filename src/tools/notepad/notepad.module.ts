import { Module } from '@nestjs/common';
import { NotepadService } from './notepad.service';
import { NotepadController } from './notepad.controller';
import { DbModule } from 'src/db/db.module';
import { Xml2JsonServiceService } from 'src/xml2-json-service/xml2-json-service.service';
import { ToolsService } from '../tools.service';

@Module({
  controllers: [NotepadController],
  providers: [NotepadService, ToolsService, Xml2JsonServiceService],
  imports: [DbModule],
})
export class NotepadModule {}
