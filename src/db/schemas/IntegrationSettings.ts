import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export enum IntegrationTypes {
  AWS = 'aws',
}

export type IntegrationSettingsDocument = IntegrationSettings & Document;

@Schema()
export class IntegrationSettings {
  @Prop({ required: true })
  integration_name: string;

  @Prop({ required: true, enum: IntegrationTypes })
  integration_type: IntegrationTypes;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  integration_settings: any;

  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  owner: Types.ObjectId;
}

export const IntegrationSettingsSchema =
  SchemaFactory.createForClass(IntegrationSettings);
