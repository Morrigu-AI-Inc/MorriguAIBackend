import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, SchemaTypes } from 'mongoose';
import { Supplier } from './Supplier';
import { LineItem } from './LineItem';
import { Organization } from './Organization';
import { User } from './User';

export type PurchaseOrderDocument = PurchaseOrder & Document;

export enum POStatus {
  Draft = 'Draft',
  RequisitionApproval = 'RequisitionApproval',
  ManagerialApproval = 'ManagerialApproval',
  SeniorManagerialApproval = 'SeniorManagerialApproval',
  FinanceApproval = 'FinanceApproval',
  ComplianceReview = 'ComplianceReview',
  ApprovalOrRejection = 'ApprovalOrRejection',
  SupplierEngagement = 'SupplierEngagement',
  OrderFulfillment = 'OrderFulfillment',
  InvoiceMatching = 'InvoiceMatching',
  PaymentProcessing = 'PaymentProcessing',
  OrderCloseout = 'OrderCloseout',
  ReportingAndAnalysis = 'ReportingAndAnalysis',
  Archive = 'Archive',
  Rejected = 'Rejected',
  POAmendment = 'POAmendment',
  IssueResolution = 'IssueResolution',
}

type POHistory = {
  status: POStatus;
  timestamp: Date;
  actionBy?: Types.ObjectId
  isAI?: boolean;
  metadata: any;
};

@Schema({
  timestamps: true,
  versionKey: 'version',
})
export class PurchaseOrder extends Document {
  @Prop({ required: true })
  po_number: string;

  @Prop({ type: Types.ObjectId, ref: 'Supplier', required: false })
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

  @Prop({ required: true, enum: POStatus, default: POStatus.Draft })
  status: POStatus;

  @Prop({ required: false, type: SchemaTypes.Mixed })
  raw: any;

  @Prop({ required: false })
  terms: string;

  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  owner: Organization;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  createdBy: User;

  @Prop({
    required: false,
    default: 'default',
    enum: ['default', 'amzn_punchout'],
  })
  type?: 'default' | 'amzn_punchout';

  @Prop({ required: false, type: SchemaTypes.Mixed })
  punchoutDetails?: any;

  @Prop({
    type: [
      {
        status: { type: String, enum: POStatus, default: POStatus.Draft },
        timestamp: Date,
        actionBy: { type: Types.ObjectId, ref: 'User' },
        metadata: SchemaTypes.Mixed,
      },
    ],
    default: [],
  })
  history: POHistory[];
}

const PurchaseOrderSchema = SchemaFactory.createForClass(PurchaseOrder);

export default PurchaseOrderSchema;
