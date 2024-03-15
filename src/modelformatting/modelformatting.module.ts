import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelFormattingSchema } from 'src/db/schemas/ModelFormatting';
import { ModelformattingService } from './modelformatting.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ModelFormatting', schema: ModelFormattingSchema },
    ]),
  ],
  providers: [ModelformattingService],
  exports: [ModelformattingService],
})
export class ModelformattingModule {}
