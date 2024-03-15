// credentials.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type CredentialsDocument = Credentials & Document;

@Schema({
  timestamps: true,
  collection: 'credentials',
})
export class Credentials {
  @Prop({ type: String, required: true, default: uuidv4, unique: true })
  clientId: string;

  @Prop({ type: String, required: true, default: uuidv4, unique: true })
  secretKey: string;

  @Prop({ type: Types.ObjectId, ref: 'Environment' })
  clientEnvId: Types.ObjectId;

  @Prop([{ type: Types.ObjectId, ref: 'User' }])
  owner: Types.ObjectId[];
}

export const CredentialsSchema = SchemaFactory.createForClass(Credentials);
