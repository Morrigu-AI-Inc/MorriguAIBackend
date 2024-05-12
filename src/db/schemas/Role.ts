// roles.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ACL, OrganizationACL, UserACL } from './ACL';

export type RoleDocument = Role & Document;

@Schema({
  collection: 'roles',
})
export class Role {
  @Prop({ required: true })
  name: string;

  @Prop({ type: String, required: true, enum: ['organization', 'user'] })
  type: string;

  @Prop({ type: Types.ObjectId, refPath: 'typeAcls' })
  acl: OrganizationACL | UserACL;

  @Prop({
    required: true,
    enum: ['organizationacls', 'useracls'],
    default: 'useracls',
  })
  typeAcls: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
