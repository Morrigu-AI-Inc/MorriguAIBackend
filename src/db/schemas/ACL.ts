// acl.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './User';

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
export class UserACL extends ACL {
  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  departmentManager: User;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  seniorManager: User;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  financeController: User;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  complianceOfficer: User;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  procurementOfficer: User;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  accountsPayable: User;
}

export const OrganizationACLSchema =
  SchemaFactory.createForClass(OrganizationACL);
export const UserACLSchema = SchemaFactory.createForClass(UserACL);
