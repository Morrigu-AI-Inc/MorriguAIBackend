import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Role } from './Role';
import { StripeAccount } from './StripeAccount';
import { UserACL } from './ACL';
import { Employee } from './Employee';

export type UserDocument = User & Document;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  provider: string;

  @Prop({ required: false, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: SchemaTypes.Mixed })
  data: unknown;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Role' })
  role: Role;

  @Prop({ required: false, type: Types.ObjectId, ref: 'StripeAccount' })
  stripeAccount: StripeAccount;

  @Prop({ required: false, type: Types.ObjectId, ref: 'UserACL' })
  acl: UserACL;

  @Prop({ required: true, type: SchemaTypes.Mixed, default: {} })
  config: any;

  @Prop({ required: true, ref: 'Employee', type: Types.ObjectId })
  employee: Employee;
}

export const UserSchema = SchemaFactory.createForClass(User);
