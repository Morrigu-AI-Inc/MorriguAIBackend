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
import { TeamService } from 'src/team/team.service';
import { QueueService } from 'src/queue/queue.service';
import { BullJobNames, BullQueues } from 'src/queue/entities/queue.entity';

@Injectable()
export class PurchasingService {
  constructor(
    @InjectModel(PurchaseOrder.name)
    private readonly purchaseOrderModel: Model<PurchaseOrderDocument>,
    @InjectModel(LineItem.name)
    private readonly lineItemmodel: Model<LineItemDocument>,
    @InjectModel('User')
    private readonly userModel: Model<User>,
    private readonly teamService: TeamService,
    private readonly queueService: QueueService,
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
  public setStatus = async (poId: string, status: POStatus, user: string) => { // user is ther person sending the request may or may not be the same as the person who created the PO
    console.log('poId', poId, 'status', status, 'user', user);
    const userObj = await this.userModel.findOne({
      _id: user,
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


    const approvers = (await this.teamService.findNextApprover(poId, user)).map((approver) => approver._id.toString());

    // if user._id is in approvers then user is authorized to change the status of this purchase order
    const isApprover = approvers.includes(userObj._id.toString());

    console.log(isApprover);

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
      case POStatus.Draft:
        // This is Approved by the requester
        // send notification to the next approver
        await this.queueService.addJob(po, BullQueues.RIGU_QUEUE, BullJobNames.ProcessDraftJob);
        break;
      case POStatus.RequisitionApproval:
        // This is approved by the department manager
        // send notification to the next approver
        await this.queueService.addJob(po, BullQueues.RIGU_QUEUE, BullJobNames.ProcessRequisitionApprovalJob);
        break;
      case POStatus.ManagerialApproval:
        // This is approval by the Senior Manager
        // send notification to the next approver
        await this.queueService.addJob(po, BullQueues.RIGU_QUEUE, BullJobNames.ProcessManagerialApprovalJob);
        break;
      case POStatus.FinanceApproval: // we will try to ai approve the PO
        // this is aprove by the finance controller
        // try to AI approve the PO
        await this.queueService.addJob(po, BullQueues.RIGU_QUEUE, BullJobNames.ProcessFinanceApprovalJob);
        break;
      case POStatus.ComplianceReview: // we will try to ai approve the PO
        // this is a review by the compliance officer
        // try to AI approve the PO
        await this.queueService.addJob(po, BullQueues.RIGU_QUEUE, BullJobNames.ProcessComplianceReviewJob);
        break;
      case POStatus.ApprovalOrRejection: // we will try to ai approve the PO
        // this happens after the compliance review and finance and it gets sent back to the senior manager to send to the procurement officer
        // send notification to the next approver
        await this.queueService.addJob(po, BullQueues.RIGU_QUEUE, BullJobNames.ProcessApprovalOrRejectionJob);
        break;
      case POStatus.SupplierEngagement:
        // this is submittial to the supplier by the procurement officer
        // send notification to the next approver
        await this.queueService.addJob(po, BullQueues.RIGU_QUEUE, BullJobNames.ProcessSupplierEngagementJob);
        break;
      case POStatus.OrderFulfillment:
        // the procurement officer is waiting for the supplier to fulfill the order if they do not then it get sent back for supplier engagement (also the procurement officer) to handle
        // send notification to the next approver
        await this.queueService.addJob(po, BullQueues.RIGU_QUEUE, BullJobNames.ProcessOrderFulfillmentJob);
        break;
      case POStatus.InvoiceMatching: // we will try to ai approve the PO
        // the procurement officer is waiting for the supplier to send the invoice 
        // if they do not get the invoice, first they check if the order was fulfilled and received if not then it goes back to order fulfillment
        // if they do not get the invoice and the order was fulfilled then it goes back to issue resolution
        // if they do get the invoice and they did not receive the order then it goes back to issue resolution
        // if they do get the invoice and it does not match the order then it goes back to issue resolution
        // if they do get the invoice and it matches the order then they send it to payment processing
        // send notification to the next approver
        await this.queueService.addJob(po, BullQueues.RIGU_QUEUE, BullJobNames.ProcessInvoiceMatchingJob);
        break;
      case POStatus.PaymentProcessing: // we will try to ai approve the PO
        // the accounts payable office is about to pay the supplier
        // shouldnt ever have to fo back to the other steps but just in case we will allow it here. 
        // send notification to the next approver
        await this.queueService.addJob(po, BullQueues.RIGU_QUEUE, BullJobNames.ProcessPaymentProcessingJob);
        break;
      case POStatus.OrderCloseout: // we will try to ai approve the PO
        // by this point the order has been paid for and the procurement officer is closing out the order and sending it to reporting and analysis
        // send notification to the next approver
        await this.queueService.addJob(po, BullQueues.RIGU_QUEUE, BullJobNames.ProcessOrderCloseoutJob);
        break;
      case POStatus.ReportingAndAnalysis: // we will try to ai approve the PO
        // the procurement officer is analyzing the order for trends, performance, and opportunities and then archiving the order
        // send notification to the next approver
        await this.queueService.addJob(po, BullQueues.RIGU_QUEUE, BullJobNames.ProcessReportingAndAnalysisJob);
        break;
      case POStatus.Archive: // we will try to ai approve the PO
        // the compliance officer is archiving the order and related documents for future reference and the process is complete 
        // send notification to the next approver
        await this.queueService.addJob(po, BullQueues.RIGU_QUEUE, BullJobNames.ProcessArchiveJob);
        break;
      case POStatus.Rejected: // we will try to ai approve the PO
        // this is when the order is rejected and needs review or cancellation by the requester
        // send notification to the next approver
        await this.queueService.addJob(po, BullQueues.RIGU_QUEUE, BullJobNames.ProcessRejectedJob);
        break;
      case POStatus.POAmendment: // we will try to ai approve the PO
        // this is when the order needs to be amended based on feedback from the supplier by the procurement officer
        // send notification to the next approver
        await this.queueService.addJob(po, BullQueues.RIGU_QUEUE, BullJobNames.ProcessPOAmendmentJob);
        break;
      case POStatus.IssueResolution: // we will try to ai approve the PO
        // this is when the procurement officer is addressing any discrepancies or issues with the order or payment and then sending it back to order fulfillment, invoice matching, or payment processing
        // send notification to the next approver
        await this.queueService.addJob(po, BullQueues.RIGU_QUEUE, BullJobNames.ProcessIssueResolutionJob);
        break;
      default:
        break;
    }

    return po;
  };
}
