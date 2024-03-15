import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { QueryResponse } from './QueryResponse';
import { Query } from './Query';

export type QueryResponsePairDocument = QueryResponsePair & Document;

@Schema({ timestamps: true, collection: 'queryresponsepairs'})
export class QueryResponsePair {
  @Prop({ type: Types.ObjectId, ref: Query.name })
  query: Types.ObjectId | Query;

  @Prop({ type: Types.ObjectId, ref: QueryResponse.name, required: false })
  response?: Types.ObjectId | QueryResponse;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  owner: Types.ObjectId;
}

export const QueryResponsePairSchema =
  SchemaFactory.createForClass(QueryResponsePair);
