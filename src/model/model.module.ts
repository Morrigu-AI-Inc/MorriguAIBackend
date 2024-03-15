import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Model, ModelSchema } from 'src/db/schemas/Model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Model', schema: ModelSchema }]),
  ],

  exports: [],
})
export class ModelModule {}
