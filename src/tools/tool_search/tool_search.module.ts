import { Module } from '@nestjs/common';
import { ToolSearchController } from './tool_search.controller';
import { ToolsService } from '../tools.service';
import { ToolDescriptionSchema } from 'src/db/schemas/Tools';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [ToolSearchController],
  providers: [ToolsService],
  imports: [
    MongooseModule.forFeature([
      { name: 'ToolDescription', schema: ToolDescriptionSchema },
    ]),
  ],
})
export class ToolSearchModule {}
