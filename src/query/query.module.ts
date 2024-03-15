import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuerySchema } from 'src/db/schemas/Query';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Query', schema: QuerySchema }]),
  ],
})
export class QueryModule {}
