import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './User';
import { Vendor } from './Vendor';
import { Employee } from './Employee';

@Schema()
export class Invoice extends Document {
  @Prop({ required: true, enum: ['Outgoing', 'Incoming'] })
  direction: string; // 'Outgoing' for invoices to customers, 'Incoming' for invoices from vendors

  @Prop({ type: Types.ObjectId, ref: 'Employee' })
  owner: Employee; // Reference to user or company issuing or receiving the invoice

  @Prop({ type: Date, default: Date.now })
  issueDate: Date;

  @Prop({ type: Date })
  dueDate: Date;

  @Prop({ type: Types.ObjectId, ref: 'Vendor' })
  vendor: Vendor;

  @Prop({ type: [{ item: String, quantity: Number, unitPrice: Number }] })
  items: { item: string; quantity: number; unitPrice: number }[];

  @Prop()
  totalAmount: Number;

  @Prop({ required: true })
  currency: String;

  @Prop({ required: true, enum: ['Unpaid', 'Paid', 'Overdue'] })
  status: string;

  @Prop()
  notes: String; // Any additional notes about the invoice
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
