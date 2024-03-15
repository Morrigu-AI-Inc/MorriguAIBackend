import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QueryResponseSchema } from 'src/db/schemas/QueryResponse';

@Module({
  imports: [MongooseModule.forFeature([
    { name: 'QueryResponse', schema: QueryResponseSchema },
  ])],
})
export class QueryresponseModule {}
