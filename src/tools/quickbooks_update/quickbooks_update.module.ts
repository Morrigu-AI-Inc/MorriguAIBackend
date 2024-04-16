import { Module } from '@nestjs/common';
import { QuickbooksUpdateController } from './quickbooks_update.controller';

@Module({
  controllers: [QuickbooksUpdateController]
})
export class QuickbooksUpdateModule {}
