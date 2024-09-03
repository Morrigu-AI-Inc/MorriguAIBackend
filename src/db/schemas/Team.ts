import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaType, Types } from 'mongoose';
import { Organization } from './Organization';

// type Root = {
//   name: string;
//   teams: Team[];
//   managerId: string;
//   seniorManagerId: string;
//   ownerGroup: Group;
//   financeGroup: Group;
//   complianceGroup: Group;
//   procurementGroup: Group;
//   accountsPayableGroup: Group;
// }

// type Group = {
//   name: string;
//   users: string[];
//   acl?: any;
// }

// type Team = {
//   managerId: string;
//   seniorManagerId: string;
//   users: string[];
//   parentTeam: Team;
//   financeGroup?: Group;
//   complianceGroup?: Group;
//   procurementGroup?: Group;
//   accountsPayableGroup?: Group;
//   acl?: any;
// }

@Schema()
export class RootOrgGroup extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [Types.ObjectId], ref: 'Team', required: true, default: [] })
  teams: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  managerId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  seniorManagerId: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Group' })
  ownerGroup: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Group' })
  financeGroup: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Group' })
  complianceGroup: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Group' })
  procurementGroup: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Group' })
  accountsPayableGroup: Types.ObjectId;
}

export const RootOrgGroupSchema = SchemaFactory.createForClass(RootOrgGroup);

@Schema()
export class Group extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [Types.ObjectId], ref: 'User', required: true })
  users: Types.ObjectId[];

  // @Prop({ required: false, type: Types.ObjectId, ref: 'UserACL' })
  // acl: Types.ObjectId;
}

export const GroupSchema = SchemaFactory.createForClass(Group);

@Schema()
export class Team extends Document {

  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  managerId: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  seniorManagerId: Types.ObjectId

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  users: Types.ObjectId[]

  @Prop({ type: [Types.ObjectId], ref: 'Team', default: [] })
  teams: Team[];

  @Prop({ required: false, type: Types.ObjectId, ref: 'Team' })
  parentTeam: Team;

  @Prop({ type: [Types.ObjectId], ref: 'Group', default: [] })
  groups: Group[]

  @Prop({ required: false, type: Types.ObjectId, ref: 'Group' })
  financeGroup: Group;

  @Prop({ required: false, type: Types.ObjectId, ref: 'Group' })
  complianceGroup: Group;

  @Prop({ required: false, type: Types.ObjectId, ref: 'Group' })
  procurementGroup: Group;

  @Prop({ required: false, type: Types.ObjectId, ref: 'Group' })
  accountsPayableGroup: Group;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
