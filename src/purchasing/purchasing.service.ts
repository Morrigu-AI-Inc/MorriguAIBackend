import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePurchasingDto } from './dto/create-purchasing.dto';
import { UpdatePurchasingDto } from './dto/update-purchasing.dto';
import {
  PurchaseOrderDocument,
  PurchaseOrder,
  POStatus,
} from 'src/db/schemas/PurchaseOrder';
import { LineItem, LineItemDocument } from 'src/db/schemas/LineItem';
import { User } from 'src/db/schemas';
import { poWorkflow } from '../workflow/entities/workflow.entity';

@Injectable()
export class PurchasingService {
  constructor(
    @InjectModel(PurchaseOrder.name)
    private readonly purchaseOrderModel: Model<PurchaseOrderDocument>,
    @InjectModel(LineItem.name)
    private readonly lineItemmodel: Model<LineItemDocument>,
    @InjectModel('User')
    private readonly userModel: Model<User>,
  ) {}

  async create(
    createPurchasingDto: CreatePurchasingDto,
  ): Promise<PurchaseOrder> {
    try {
      // export class PurchaseOrder extends Document {
      //   @Prop({ required: true })
      //   po_number: string;

      //   @Prop({ type: Types.ObjectId, ref: 'Supplier', required: true })
      //   supplier: Supplier;

      //   @Prop({
      //     type: [Types.ObjectId],
      //     ref: 'LineItem',
      //     required: false,
      //     default: [],
      //   })
      //   line_items: object[];

      //   @Prop({ required: true })
      //   orderDate: Date;

      //   @Prop({ required: true })
      //   deliveryDate: Date;

      //   @Prop({ required: true })
      //   totalAmount: number;

      //   @Prop({ required: true, enum: POStatus, default: POStatus.SENT })
      //   status: POStatus;

      //   @Prop({ required: false, type: SchemaTypes.Mixed })
      //   raw: any;

      //   @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
      //   owner: Organization;
      // }

      // create 1 purchase order first then create line items
      const newPo: Partial<PurchaseOrder> = {
        status: POStatus.Draft,
        po_number: createPurchasingDto.poNumber,
        supplier:
          createPurchasingDto.supplier._id.length > 0
            ? createPurchasingDto.supplier._id
            : null,
        orderDate: new Date(),
        line_items: [],
        totalAmount: createPurchasingDto.items.reduce(
          (acc, item) => acc + item.total,
          0,
        ),
        deliveryDate: new Date(),
        raw: createPurchasingDto,
        owner: createPurchasingDto.owner,
        history: [],
      };

      const createdPurchaseOrder = new this.purchaseOrderModel(newPo);

      if (!createdPurchaseOrder) {
        throw new Error('Failed to create purchase order');
      }

      const lineItems = createPurchasingDto.items.map((item) => ({
        po_number: createdPurchaseOrder._id,
        productName: item.item,
        quantity: item.quantity,
        price: item.unitPrice,
        totalPrice: item.total,
        raw: item,
      }));

      const createdLineItems = await this.lineItemmodel.insertMany(lineItems);

      if (!createdLineItems) {
        throw new Error('Failed to create line items');
      }

      // update the purchase order with the line items so that the line items are linked to the purchase order
      createdPurchaseOrder.line_items = createdLineItems.map(
        (item) => item._id,
      );

      console.log('createdPurchaseOrder', createdPurchaseOrder);

      return createdPurchaseOrder.save();
    } catch (error) {
      console.log(error);
    }
  }

  async findAll(
    owner: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: PurchaseOrder[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
  }> {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const total = await this.purchaseOrderModel
      .find({ owner })
      .countDocuments();
    const totalPages = Math.ceil(total / limit);

    const ownerAsObjectId = Types.ObjectId.isValid(owner)
      ? new Types.ObjectId(owner)
      : null;

    const purchaseOrders = await this.purchaseOrderModel
      .find({
        $or: [
          { owner: owner }, // Match if owner is a string
          { owner: ownerAsObjectId }, // Match if owner is an ObjectId
        ],
      })
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 }) // Order by created date
      .populate('supplier')
      .populate('line_items')
      .exec();

    console.log('purchaseOrders', purchaseOrders);

    return {
      data: purchaseOrders,
      currentPage: page,
      totalPages: totalPages,
      totalItems: total,
    };
  }
  // purchaseOrder {
  //   _id: new ObjectId('66d13267f17991c625a0301b'),
  //   po_number: '1724985785611.570.8640@amazon.com',
  //   line_items: [
  //     {
  //       productName: '69551512',
  //       quantity: 1,
  //       price: 4.98,
  //       totalPrice: '4.98',
  //       raw: [Object],
  //       type: 'amzn_punchout',
  //       punchoutDefails: [Array],
  //       _id: new ObjectId('66d13267f17991c625a0301a')
  //     }
  //   ],
  //   orderDate: 2024-08-30T02:43:05.619Z,
  //   deliveryDate: 2024-09-06T02:43:05.619Z,
  //   totalAmount: 4.98,
  //   status: 'SENT',
  //   raw: { cXML: { '$': [Object], Header: [Array], Message: [Array] } },
  //   terms: 'Net 30',
  //   owner: new ObjectId('6657613c32a41b8769a79eba'),
  //   type: 'amzn_punchout',
  //   createdAt: 2024-08-30T02:45:59.615Z,
  //   updatedAt: 2024-08-30T02:45:59.615Z,
  //   version: 0
  // }
  async findOne(id: string): Promise<PurchaseOrder> {
    const purchaseOrder = await this.purchaseOrderModel
      .findOne({ po_number: id })
      .populate('supplier')
      .populate('line_items')
      .populate('history.actionBy')
      .exec();

    console.log('purchaseOrder', purchaseOrder);

    if (!purchaseOrder) {
      throw new NotFoundException(`PurchaseOrder with ID ${id} not found`);
    }

    return purchaseOrder;
  }

  async update(
    id: string,
    updatePurchasingDto: UpdatePurchasingDto,
  ): Promise<PurchaseOrder> {
    const updatedPurchaseOrder = await this.purchaseOrderModel
      .findByIdAndUpdate(id, updatePurchasingDto, { new: true })
      .exec();
    if (!updatedPurchaseOrder) {
      throw new NotFoundException(`PurchaseOrder with ID ${id} not found`);
    }
    return updatedPurchaseOrder;
  }

  async remove(id: string): Promise<PurchaseOrder> {
    const deletedPurchaseOrder = await this.purchaseOrderModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedPurchaseOrder) {
      throw new NotFoundException(`PurchaseOrder with ID ${id} not found`);
    }
    return deletedPurchaseOrder;
  }

  // todo: We need to check if the person trying to change the status has the right permissions to do so
  public setStatus = async (poId: string, status: POStatus, user: string) => {
    console.log('poId', poId, 'status', status, 'user', user);
    const userObj = await this.userModel.findOne({
      id: user,
    });

    if (!userObj) {
      throw new Error('User not found');
    }

    const po = await this.purchaseOrderModel.findOne({
      _id: poId,
    });

    const createdBy = await this.userModel
      .findOne({
        _id: po.createdBy,
      })
      .populate('acl');

    if (!po) {
      throw new Error('Purchase order not found');
    }

    // we have everything we need to calculate the authorization for approval or rejection

    const lastHistoryItem = po.history[po.history.length - 1];
    console.log('lastHistoryItem', lastHistoryItem);
    const currentWorkflow = poWorkflow[lastHistoryItem.status];
    console.log('currentWorkflow', currentWorkflow);
    console.log('createdBy', createdBy);

    const isRequester =
      currentWorkflow.approverRole === 'requester' &&
      createdBy._id.toString() === userObj._id.toString(); // the current approver is the requester

    console.log('isRequester', isRequester);

    const isApprover =
      createdBy.acl[currentWorkflow.approverRole] === userObj._id ||
      isRequester;

    if (!isApprover) {
      throw new Error(
        'User is not authorized to change the status of this purchase order',
      );
    } else {
      console.log(
        'User is authorized to change the status of this purchase order',
      );
    }

    po.history.push({
      status,
      actionBy: userObj._id,
      timestamp: new Date(),
      metadata: {},
    });

    po.status = status;

    await po.save();

    switch (status) {
      case POStatus.RequisitionApproval:
        // send notification to the next approver
        break;
      case POStatus.ManagerialApproval:
        // send notification to the next approver
        break;
      case POStatus.FinanceApproval:
        // send notification to the next approver
        break;
      case POStatus.ComplianceReview:
        // send notification to the next approver
        break;
      case POStatus.ApprovalOrRejection:
        // send notification to the next approver
        break;
      case POStatus.SupplierEngagement:
        // send notification to the next approver
        break;
      case POStatus.OrderFulfillment:
        // send notification to the next approver
        break;
      case POStatus.InvoiceMatching:
        // send notification to the next approver
        break;
      case POStatus.PaymentProcessing:
        // send notification to the next approver
        break;
      case POStatus.OrderCloseout:
        // send notification to the next approver
        break;
      case POStatus.ReportingAndAnalysis:
        // send notification to the next approver
        break;
      case POStatus.Archive:
        // send notification to the next approver
        break;
      case POStatus.Rejected:
        // send notification to the next approver
        break;
      case POStatus.POAmendment:
        // send notification to the next approver
        break;
      case POStatus.IssueResolution:
        // send notification to the next approver
        break;
      default:
        break;
    }

    return po;
  };
}
