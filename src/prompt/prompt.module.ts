import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PromptSchema } from 'src/db/schemas/Prompt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Prompt', schema: PromptSchema }]),
  ],
})
export class PromptModule {}
