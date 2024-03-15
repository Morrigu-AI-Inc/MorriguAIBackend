import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PromptVersionSchema } from 'src/db/schemas/PromptVersion';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'PromptVersion', schema: PromptVersionSchema },
    ]),
  ],
})
export class PromptversionModule {}
