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
import { poWorkflow, WorkflowStep } from '../workflow/entities/workflow.entity';
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
  public setStatus = async (
    poId: string,
    status: POStatus,
    user: string,
    isAI?: boolean,
    metadata?: any,
  ) => {
    // user is ther person sending the request may or may not be the same as the person who created the PO
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

    const approvers = (await this.teamService.findNextApprover(poId, user)).map(
      (approver) => approver._id.toString(),
    );

    // if user._id is in approvers then user is authorized to change the status of this purchase order
    const isApprover = approvers.includes(userObj._id.toString());

    if (!isApprover && !isAI) {
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
      actionBy: createdBy._id,
      isAI: isAI || false,
      timestamp: new Date(),
      metadata: metadata || {},
    });

    po.status = status;

    await po.save();

    // we are going to describe an auto mode where AI will assist the next steps

    // If the status is (RequisitionApproval) - The next step in auto mode is nothing a human has to approve this
    // If the status is (ManagerialApproval) - The next step is FinanceApproval - The AI will try to approve the PO
    // If the status is (FinanceApproval) - The next step is ComplianceReview - The AI will try to approve the PO
    // If the status is (ComplianceReview) - The next step is SupplierEngagement - this is manual
    //     - During Supplier Engagement we need to check if the vendor is a preffered vendor.
    //    - Does the vendor still have the item in stock
    //    - Can the vendor deliver the item on time
    //    - Ensure nothing has changed in the order since the last time it was reviewed
    //    - Ensure the vendor has not been blacklisted
    // If the status is (SupplierEngagement) - The next stop is ApprovalOrRejection - The AI will try to approve the PO
    // If the status is (ApprovalOrRejection) - The next step is OrderFulfillment - The AI will try to approve the PO

    // Draft

    // If the status is (Draft) - The next step is RequisitionApproval - We wait for the requester to approve the PO

    // RequisitionApproval

    // If the status is (RequisitionApproval) - The next step is ManagerialApproval - we wait for the department manager to approve the PO

    // ManagerialApproval

    // During ManagerialApproval:

    // The manager of the team needs to approve the PO
    // if the manager does not approve the PO then the PO is Rejected
    // if the manager approves the PO then the PO is sent to for FinanceApproval

    // If the status is (ManagerialApproval) - The next step is FinanceApproval

    // FinanceApproval

    // During FinanceApproval:

    // The finance controller needs to approve the PO
    // if the finance controller does not approve the PO then the PO is Rejected
    // if the finance controller approves the PO then the PO is sent to ComplianceReview

    // If the status is (FinanceApproval) - The next step is ComplianceReview - The AI will try to approve

    // ComplianceReview

    // During ComplianceReview:
    // The compliance officer needs to approve the PO
    // if the compliance officer does not approve the PO then the PO is Rejected
    // if the compliance officer approves the PO then the PO is sent to SupplierEngagement

    // If the status is (ComplianceReview) - The next step is SupplierEngagement - // This is manual

    // SupplierEngagement

    // During SupplierEngagement:
    // The procurement officer needs to engage the supplier
    // The procurement officer needs to check if the vendor is a preffered vendor
    // The procurement officer needs to check if the vendor still has the item in stock
    // The procurement officer needs to check if the vendor can deliver the item on time
    // The procurement officer needs to ensure nothing has changed in the order since the last time it was reviewed

    // Once the procurement officer has done all of the above they can approve the PO and send it to ApprovalOrRejection

    // If the status is (SupplierEngagement) - The next step is ApprovalOrRejection - The AI will try to approve the PO

    // ApprovalOrRejection

    // During ApprovalOrRejection:

    // The senior manager needs to approve the PO
    // if the senior manager does not approve the PO then the PO is Rejected
    //  if the senior manager approves the PO then the PO is sent to OrderFulfillment

    // If the status is (ApprovalOrRejection) - The next step is OrderFulfillment - // The AI will try to approve the PO

    // OrderFulfillment

    // During OrderFulfillment:

    // The procurement officer is waiting for the supplier to fulfill the order
    // If the supplier does not fulfill the order then the procurement officer needs to engage the supplier again and send it back to SupplierEngagement
    // If the supplier fulfills the order then the procurement officer needs to wait for bot InvoiceMatching and PaymentProcessing to be in the history of the PO before sending it to OrderCloseout

    // If the status is (OrderFulfillment) - The next step is Nothing // we wait for the supplier to fulfill the order

    // InvoiceMatching

    /// During InvoiceMatching:
    // The procurement officer is waiting for the supplier to send the invoice
    // If the supplier does not send the invoice then the procurement officer needs to engage the supplier again and send it back to SupplierEngagement
    // If the supplier sends the invoice then the procurement officer needs to check if the order was fulfilled and received
    // If the order was not fulfilled and received then the procurement officer needs to send it back to OrderFulfillment
    // If the order was fulfilled and received then the procurement officer needs to check if the invoice matches the order
    // If the invoice does not match the order then the procurement officer needs to send it back to IssueResolution
    // If the invoice matches the order then the procurement officer needs to send it to PaymentProcessing

    // If the status is (InvoiceMatching) - We do nothing we are waiting on both PaymentProcessing and OrderFulfillment to be in the history of the PO

    // PaymentProcessing

    // During PaymentProcessing:

    // The accounts payable office is about to pay the supplier
    // If the accounts payable office does not pay the supplier then the procurement officer needs to send it back to InvoiceMatching
    // If the accounts payable office pays the supplier then the procurement officer needs to send it to OrderCloseout
    // If the accounts payable office pays the supplier and the supplier does not fulfill the order then the procurement officer needs to send it back to OrderFulfillment
    // If the accounts payable office pays the supplier and the supplier fulfills the order then the procurement officer needs to send it to OrderCloseout
    // If the accounts payable office pays the supplier and the supplier fulfills the order and the invoice does not match the order then the procurement officer needs to send it back to InvoiceMatching
    // If the accounts payable office pays the supplier and the supplier fulfills the order and the invoice matches the order then the procurement officer needs to send it to OrderCloseout

    // If the status is (PaymentProcessing) - We are waiting for PaymentProcessing, InvoiceMatching, and OrderFulfillment to be in the history of the PO

    // OrderCloseout

    // During OrderCloseout:
    // The procurement officer is closing out the order and sending it to ReportingAndAnalysis

    // If the status is (OrderCloseout) - The next step is ReportingAndAnalysis // The AI will try to approve the PO

    // ReportingAndAnalysis

    // During ReportingAndAnalysis:
    // The procurement officer is analyzing the order for trends, performance, and opportunities and then archiving the order
    // The procurement officer is archiving the order and related documents for future reference and the process is complete

    // If the status is (ReportingAndAnalysis) - The next step is Archive // The AI will try to approve the PO

    // Archive

    // During Archive:
    // The compliance officer is archiving the order and related documents for future reference and the process is complete

    // If the status is (Archive) - The next step is Nothing // The AI will try to approve the PO

    // Rejected

    // If the status is (Rejected) - The next step is Draft

    // POAmendment

    // If the status is (POAmendment) - The next step is Draft

    // IssueResolution

    // If the status is (IssueResolution) - We wait for the procurement officer to resolve the issue

    // todo: Add config to enable or disable AI mode

    const stage: WorkflowStep = poWorkflow[status];

    if (stage.autoMode) {

      const nextStatus = stage.autoAction;

      switch (nextStatus) {
        case POStatus.Draft:
          // This is Approved by the requester
          // send notification to the next approver
          await this.queueService.addJob(
            po,
            BullQueues.RIGU_QUEUE,
            BullJobNames.ProcessDraftJob,
          );
          break;
        case POStatus.RequisitionApproval:
          // This is approved by the department manager
          // send notification to the next approver
          await this.queueService.addJob(
            po,
            BullQueues.RIGU_QUEUE,
            BullJobNames.ProcessRequisitionApprovalJob,
          );
          break;
        case POStatus.ManagerialApproval:
          // This is approval by the Senior Manager
          // send notification to the next approver
          await this.queueService.addJob(
            po,
            BullQueues.RIGU_QUEUE,
            BullJobNames.ProcessManagerialApprovalJob,
          );
          break;
        case POStatus.FinanceApproval: // we will try to ai approve the PO
          // this is aprove by the finance controller
          // try to AI approve the PO
          await this.queueService.addJob(
            po,
            BullQueues.RIGU_QUEUE,
            BullJobNames.ProcessFinanceApprovalJob,
          );
          break;
        case POStatus.ComplianceReview: // we will try to ai approve the PO
          // this is a review by the compliance officer
          // try to AI approve the PO
          await this.queueService.addJob(
            po,
            BullQueues.RIGU_QUEUE,
            BullJobNames.ProcessComplianceReviewJob,
          );
          break;
        case POStatus.ApprovalOrRejection: // we will try to ai approve the PO
          // this happens after the compliance review and finance and it gets sent back to the senior manager to send to the procurement officer
          // send notification to the next approver
          await this.queueService.addJob(
            po,
            BullQueues.RIGU_QUEUE,
            BullJobNames.ProcessApprovalOrRejectionJob,
          );
          break;
        case POStatus.SupplierEngagement:
          // this is submittial to the supplier by the procurement officer
          // send notification to the next approver
          await this.queueService.addJob(
            po,
            BullQueues.RIGU_QUEUE,
            BullJobNames.ProcessSupplierEngagementJob,
          );
          break;
        case POStatus.OrderFulfillment:
          // the procurement officer is waiting for the supplier to fulfill the order if they do not then it get sent back for supplier engagement (also the procurement officer) to handle
          // send notification to the next approver
          await this.queueService.addJob(
            po,
            BullQueues.RIGU_QUEUE,
            BullJobNames.ProcessOrderFulfillmentJob,
          );
          break;
        case POStatus.InvoiceMatching: // we will try to ai approve the PO
          // the procurement officer is waiting for the supplier to send the invoice
          // if they do not get the invoice, first they check if the order was fulfilled and received if not then it goes back to order fulfillment
          // if they do not get the invoice and the order was fulfilled then it goes back to issue resolution
          // if they do get the invoice and they did not receive the order then it goes back to issue resolution
          // if they do get the invoice and it does not match the order then it goes back to issue resolution
          // if they do get the invoice and it matches the order then they send it to payment processing
          // send notification to the next approver
          await this.queueService.addJob(
            po,
            BullQueues.RIGU_QUEUE,
            BullJobNames.ProcessInvoiceMatchingJob,
          );
          break;
        case POStatus.PaymentProcessing: // we will try to ai approve the PO
          // the accounts payable office is about to pay the supplier
          // shouldnt ever have to fo back to the other steps but just in case we will allow it here.
          // send notification to the next approver
          await this.queueService.addJob(
            po,
            BullQueues.RIGU_QUEUE,
            BullJobNames.ProcessPaymentProcessingJob,
          );
          break;
        case POStatus.OrderCloseout: // we will try to ai approve the PO
          // by this point the order has been paid for and the procurement officer is closing out the order and sending it to reporting and analysis
          // send notification to the next approver
          await this.queueService.addJob(
            po,
            BullQueues.RIGU_QUEUE,
            BullJobNames.ProcessOrderCloseoutJob,
          );
          break;
        case POStatus.ReportingAndAnalysis: // we will try to ai approve the PO
          // the procurement officer is analyzing the order for trends, performance, and opportunities and then archiving the order
          // send notification to the next approver
          await this.queueService.addJob(
            po,
            BullQueues.RIGU_QUEUE,
            BullJobNames.ProcessReportingAndAnalysisJob,
          );
          break;
        case POStatus.Archive: // we will try to ai approve the PO
          // the compliance officer is archiving the order and related documents for future reference and the process is complete
          // send notification to the next approver
          await this.queueService.addJob(
            po,
            BullQueues.RIGU_QUEUE,
            BullJobNames.ProcessArchiveJob,
          );
          break;
        case POStatus.Rejected: // we will try to ai approve the PO
          // this is when the order is rejected and needs review or cancellation by the requester
          // send notification to the next approver
          await this.queueService.addJob(
            po,
            BullQueues.RIGU_QUEUE,
            BullJobNames.ProcessRejectedJob,
          );
          break;
        case POStatus.POAmendment: // we will try to ai approve the PO
          // this is when the order needs to be amended based on feedback from the supplier by the procurement officer
          // send notification to the next approver
          await this.queueService.addJob(
            po,
            BullQueues.RIGU_QUEUE,
            BullJobNames.ProcessPOAmendmentJob,
          );
          break;
        case POStatus.IssueResolution: // we will try to ai approve the PO
          // this is when the procurement officer is addressing any discrepancies or issues with the order or payment and then sending it back to order fulfillment, invoice matching, or payment processing
          // send notification to the next approver
          await this.queueService.addJob(
            po,
            BullQueues.RIGU_QUEUE,
            BullJobNames.ProcessIssueResolutionJob,
          );
          break;
        default:
          break;
      }
    }

    return po;
  };
}
