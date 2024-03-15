import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QueryResponsePairSchema } from 'src/db/schemas/QueryResponsePair';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'QueryResponsePair', schema: QueryResponsePairSchema },
  ])],
})
export class QueryresponsepairsModule {}
