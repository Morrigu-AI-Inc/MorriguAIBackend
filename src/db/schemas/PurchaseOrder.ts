import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, SchemaTypes } from 'mongoose';
import { Supplier } from './Supplier';
import { Product } from './Product';
import { LineItem, LineItemDocument } from './LineItem';
import { OrganizationDocument, Organization } from './Organization';

export type PurchaseOrderDocument = PurchaseOrder & Document;

export enum POStatus {
  CREATED = 'CREATED',
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  PENDING = 'PENDING',
  CONTRACT_SENT = 'CONTRACT_SENT',
  CONTRACT_SIGNED = 'CONTRACT_SIGNED',
  WAITING_FOR_PAYMENT = 'WAITING_FOR_PAYMENT',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  IN_PROGRESS = 'IN_PROGRESS',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

@Schema({
  timestamps: true,
  versionKey: 'version',
})
export class PurchaseOrder extends Document {
  @Prop({ required: true })
  po_number: string;

  @Prop({ type: Types.ObjectId, ref: 'Supplier', required: true })
  supplier: Supplier;

  @Prop({
    type: [Types.ObjectId],
    ref: 'LineItem',
    required: false,
    default: [],
  })
  line_items: LineItem[];

  @Prop({ required: true })
  orderDate: Date;

  @Prop({ required: true })
  deliveryDate: Date;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true, enum: POStatus, default: POStatus.SENT })
  status: POStatus;

  @Prop({ required: false, type: SchemaTypes.Mixed })
  raw: any;

  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  owner: Organization;
}

const PurchaseOrderSchema = SchemaFactory.createForClass(PurchaseOrder);

export default PurchaseOrderSchema;
