import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type QueryDocument = Query & Document;

@Schema({ timestamps: true, collection: 'queries' })
export class Query {
  @Prop({ type: Object, required: true })
  body: object;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  owner: Types.ObjectId;
}

export const QuerySchema = SchemaFactory.createForClass(Query);
