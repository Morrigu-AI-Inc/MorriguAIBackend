import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class ExpenseApproval extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Expense' })
  expense: Types.ObjectId; // Reference to the Expense document

  @Prop({ type: Types.ObjectId, ref: 'User' })
  submittedBy: Types.ObjectId; // Employee who submitted the expense

  @Prop({ type: Types.ObjectId, ref: 'Team' })
  team: Types.ObjectId; // Team under which the expense is submitted

  @Prop({ type: Types.ObjectId, ref: 'Department' })
  department: Types.ObjectId; // Department of the team

  @Prop({ type: Types.ObjectId, ref: 'Organization' })
  organization: Types.ObjectId; // Organization to which the department belongs

  @Prop({ type: Date, default: Date.now })
  submittedOn: Date; // Date the expense was submitted

  @Prop({
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  })
  status: string; // Current status of the expense approval

  @Prop({ type: Types.ObjectId, ref: 'User' })
  reviewedBy: Types.ObjectId; // The user who last reviewed the expense

  @Prop({ type: Date })
  reviewedOn: Date; // Date the expense was last reviewed

  @Prop({
    type: [
      {
        commenter: { type: Types.ObjectId, ref: 'User' },
        message: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  comments: { commenter: Types.ObjectId; message: string; timestamp: Date }[]; // Structured comments for approval/rejection
}

export const ExpenseApprovalSchema =
  SchemaFactory.createForClass(ExpenseApproval);
