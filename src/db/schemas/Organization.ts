import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type OrganizationDocument = Organization & Document;

@Schema({ timestamps: true })
export class Organization {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  users: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'OrganizationACL', required: true })
  default_acl: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Billing', required: true })
  billing: Types.ObjectId;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  config: any;

  @Prop({ type: SchemaTypes.Mixed, required: true, default: {} })
  usage: object;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
