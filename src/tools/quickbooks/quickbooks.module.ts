import { Module } from '@nestjs/common';
import { QuickbooksService } from './quickbooks.service';
import { QuickbooksController } from './quickbooks.controller';
import { ToolsService } from '../tools.service';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [QuickbooksController],
  providers: [QuickbooksService, ToolsService],
  imports: [DbModule],
})
export class QuickbooksModule {}
