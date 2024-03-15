// acl.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrganizationACLDocument = OrganizationACL & Document;
export type UserACLDocument = UserACL & Document;

@Schema({
  collection: 'acls',
})
export class ACL {
  @Prop({ type: [String], required: true, default: [] })
  permissions: string[];
}

// Note: If OrganizationACL and UserACL have the same properties,
// you can directly use ACL class without extending it.
// If they have different properties, define them in their respective classes.

@Schema({
  collection: 'organizationacls',
})
export class OrganizationACL extends ACL {}

@Schema({
  collection: 'useracls',
})
export class UserACL extends ACL {}

export const OrganizationACLSchema =
  SchemaFactory.createForClass(OrganizationACL);
export const UserACLSchema = SchemaFactory.createForClass(UserACL);
