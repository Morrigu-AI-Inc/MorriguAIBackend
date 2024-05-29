import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Assistant } from './Assistant';

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

  @Prop({ type: Types.ObjectId, ref: 'OrganizationACL', required: false })
  default_acl: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Billing', required: false })
  billing: Types.ObjectId;

  @Prop({ type: SchemaTypes.Mixed, required: true, default: {} })
  config: any;

  @Prop({ type: SchemaTypes.Mixed, required: true, default: {} })
  usage: object;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Role' }] })
  roles: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Department' }] })
  departments: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Assistant', required: false })
  assistant: Assistant;

  @Prop({ type: Types.ObjectId, ref: 'Assistant', required: false })
  json_assistant: Assistant;

  @Prop({ type: Types.ObjectId, ref: 'Assistant', required: false })
  work_assistant: Assistant;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
