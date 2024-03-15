import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import PromptFlagSchema from './schemas/PromptFlag';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'PromptFlag',
        schema: PromptFlagSchema,
        collection: 'promptFlags',
      },
    ]),
  ],
})
export class DbModule {}
