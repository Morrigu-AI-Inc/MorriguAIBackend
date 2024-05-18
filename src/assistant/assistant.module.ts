import { Module } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { DbModule } from 'src/db/db.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ToolInputSchema } from 'src/db/schemas/ToolInput';

@Module({
  providers: [AssistantService],
  imports: [DbModule],
})
export class AssistantModule {}
