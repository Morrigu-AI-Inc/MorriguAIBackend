import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InferenceParametersSchema } from 'src/db/schemas/InferenceParameters';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'InferenceParameters', schema: InferenceParametersSchema },
    ]),
  ],
})
export class InferenceparametersModule {}
