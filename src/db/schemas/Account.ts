// account.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AccountDocument = Account & Document;

@Schema({
  collection: 'accounts',
})
export class Account {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    enum: ['Bank Account', 'Credit Card', 'PayPal', 'Other'],
  })
  type: string;

  @Prop({ required: true })
  accountNumber: string;

  @Prop()
  currentBalance: number;

  @Prop({ required: true })
  currency: string;

  @Prop()
  creditLimit?: number; // Only for credit card accounts

  @Prop({ default: Date.now })
  lastActivityDate: Date;

  @Prop({ required: true, enum: ['Active', 'Inactive', 'Frozen', 'Closed'] })
  status: string;

  @Prop()
  bankName?: string; // Optional, primarily for bank accounts

  @Prop()
  branchCode?: string; // Optional, primarily for bank accounts

  @Prop()
  swiftCode?: string; // Optional, for international transactions

  @Prop({ required: true })
  owner: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
