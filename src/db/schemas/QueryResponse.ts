import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type QueryResponseDocument = QueryResponse & Document;

@Schema({ timestamps: true, collection: 'queryresponses' })
export class QueryResponse {
  @Prop({ type: Object, required: true })
  body: object;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  owner: Types.ObjectId;
}

export const QueryResponseSchema = SchemaFactory.createForClass(QueryResponse);
