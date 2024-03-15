// environment.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { randomUUID } from 'crypto';

export type EnvironmentDocument = Environment & Document;

@Schema({ timestamps: true })
export class Environment {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  key: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: false })
  critical: boolean;

  @Prop({ default: randomUUID })
  sdkKey: string;

  @Prop({ default: randomUUID })
  mobileKey: string;

  @Prop({ default: randomUUID })
  clientId: string;

  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  owner: Types.ObjectId;
}

export const EnvironmentSchema = SchemaFactory.createForClass(Environment);
