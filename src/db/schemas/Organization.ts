import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Assistant } from './Assistant';
import { RootOrgGroup } from './Team';

export type PunchoutConfig = {
  punchoutUrl: string;
  punchoutTestUrl: string;
  poRequestUrl: string;
  sharedSecret: string;
  fromIdentity: string;
};

export type OrgSettings = {
  amzn_punchout: string; // this is the encrypted punchout config json string
};

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

  @Prop({ type: Types.ObjectId, ref: 'APIKey', required: false })
  api_keys: Types.ObjectId[];

  @Prop({ type: SchemaTypes.Mixed, required: true, default: {} })
  settings: OrgSettings;

  @Prop({ type: Types.ObjectId, ref: 'RootOrgGroup', required: false })
  rootOrgGroup: RootOrgGroup;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
