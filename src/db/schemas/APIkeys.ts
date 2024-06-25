// api-keys.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type APIKeysDocument = APIKeys & Document;

@Schema({ timestamps: true, versionKey: false})
export class APIKeys {
  @Prop({ type: SchemaTypes.Mixed, required: true })
  value: string | number | Array<string | number>;

  @Prop({ required: true })
  key: string;
}

export const APIKeysSchema = SchemaFactory.createForClass(APIKeys);
