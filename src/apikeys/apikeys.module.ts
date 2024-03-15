import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APIKeysSchema } from 'src/db/schemas/APIkeys';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ApiKeys', schema: APIKeysSchema }]),
  ],
})
export class ApikeysModule {}
