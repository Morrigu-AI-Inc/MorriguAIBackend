import { Processor, Process } from '@nestjs/bull';
import Bull from 'bull';
import { Job } from 'bullmq';
import { BullJobNames, BullQueues } from '../entities/queue.entity';
import { PurchasingService } from 'src/purchasing/purchasing.service';
import { POStatus, PurchaseOrder } from 'src/db/schemas/PurchaseOrder';
import { Injectable } from '@nestjs/common';
import { OpenAIApiResponse, OpenaiService } from 'src/openai/openai.service';
import { OrganizationService } from 'src/organization/organization.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Organization } from 'src/db/schemas';

const template = (org, po) => `
========= Purchase Order Approval Policy =========
Company Name: ${org.name || 'Acme Corp'}
Policy: Procurement Policy - ACME Procurement Policy v1.0

Department Budget: 
- Annual Budget: $500,000
- Department: ${'Engineering' || 'Engineering'}
- Current Expenditure: $350,000
- Remaining Budget: $150,000

========= Instructions =========
A purchase order has been submitted for approval under the company procurement policy.

According to Acme Corp's procurement policy, all purchase orders must undergo multi-level approval based on the order value:
- Orders under $5,000: Auto-approved by the system
- Orders between $5,000 and $50,000: Department Manager Approval
- Orders above $50,000: Requires Finance and Compliance Approval

The current purchase order falls under the category of ${po.totalAmount > 50000 ? 'Finance and Compliance' : po.totalAmount > 5000 ? 'Department Manager' : 'Auto-approval'}.

========= Purchase Order Details =========
The purchase order contains the following items:

${po.line_items
  .map((line) => {
    return `
  - Product: ${line.productName || 'Unknown Product'} 
    - Quantity: ${line.quantity || 1}
    - Unit Price: $${line.price || 0}
    - Total Price: $${line.totalPrice || line.price * line.quantity}
  `;
  })
  .join('')}

Total Order Value: $${po.totalAmount || 0}

The purchase order was created by ${po.createdBy.name || 'John Doe'} (Department: 'Unknown Department'}).

========= Approval Process =========
After this step, the purchase order will be sent to the next approver, who is the department manager or finance controller, depending on the total value.

======== End of Instructions ========

Please respond in JSON format with the approval status of the purchase order and provide a full explanation for your decision.

The following JSON Schema should be used when responding:
{
  "type": "object",
  "properties": {
    "approved": {
      "type": "boolean"
    },
    "reasoning": {
      "type": "string",
      "description": "Detailed reasoning behind the approval or rejection decision"
    },
    "approvalStatus": {
      "type": "string",
      "enum": ["Approved", "Rejected", "Escalated"],
      "description": "The final status of the purchase order"
    },
    "nextSteps": {
      "type": "string",
      "description": "Instructions for the next steps in the approval workflow"
    }
  },
  "required": ["approved", "reasoning", "approvalStatus", "nextSteps"]
}

Here’s an example response:

{
  "approved": true,
  "reasoning": "The purchase order is within the department's budget and the items are essential for upcoming projects.",
  "approvalStatus": "Approved",
  "nextSteps": "The purchase order will now be forwarded to the finance team for final processing and vendor engagement."
}
`;

@Processor(BullQueues.RIGU_QUEUE)
export class RiguQConsumer {
  // return this.purchasingService.setStatus(poId, status, user);
  constructor(
    private readonly purchasingService: PurchasingService,
    private readonly openAiService: OpenaiService,
    private readonly organizationService: OrganizationService,
    @InjectModel('PurchaseOrder')
    private readonly purchaseOrderModel: Model<PurchaseOrder>,
    @InjectModel('Organization')
    private readonly organizationModel: Model<Organization>,
  ) {}

  async processTemplate<T>(
    template: () => string,
    data: Job<PurchaseOrder>,
  ): Promise<T> {
    const po = await this.purchaseOrderModel.findOne({
      _id: data.data._id,
    });

    if (!po) {
      throw new Error('PO not found');
    }

    await po.populate('owner');
    await po.populate('line_items');
    await po.populate('createdBy');

    if (!po.owner) {
      throw new Error('Organization not found');
    }

    const org = po.owner;

    console.log('Processing template for:', org.name, po._id);

    const resp: OpenAIApiResponse = await this.openAiService.runSingleCall(
      template(),
      [
        {
          role: 'assistant',
          content:
            'Working on the purchase order approval process. One moment please...',
        },
      ],
      (org as any)._id,
      {
        mode: 'json',
      },
    );
    console.log('OpenAI Response:', JSON.stringify(resp, null, 2));
    console.log('OpenAI Response:', resp.data[0].content[0].text);
    const respText = resp.data[0].content[0].text.value;
    const respJson = JSON.parse(respText);

    console.log('OpenAI Response:', respJson);

    return respJson;
  }

  @Process(BullJobNames.RIGU_JOB)
  async handleJob({ data: { poId, status, actionBy }, id }: Job) {
    console.log('Processing job:', id, poId, status, actionBy);
    // await this.purchasingService.setStatus(poId, status, actionBy);
    // Your job processing logic goes here
  }

  @Process(BullJobNames.ProcessDraftJob)
  async handleDraftJob({ data, id }: Job<PurchaseOrder>) {
    console.log('Processing job:', id, data);

    // await this.purchasingService.setStatus(job.data.poId, job.data.status, job.data.actionBy);
    // Your job processing logic goes here
  }

  @Process(BullJobNames.ProcessRequisitionApprovalJob)
  async handleRequisitionApprovalJob(job: Job<PurchaseOrder>) {
    // find the org from the po owner

    console.log('Processing job: - Requisition Approval', job.id, job.data);

    await this.purchasingService.setStatus(
      job.data._id,
      POStatus.RequisitionApproval,
      job.data.createdBy as any,
      true,
    );
  }

  @Process(BullJobNames.ProcessManagerialApprovalJob)
  async handleManagerialApprovalJob(job: Job<PurchaseOrder>) {
    console.log('Processing job: - Managerial Approval', job.id, job.data);

    await this.purchasingService.setStatus(
      job.data._id,
      POStatus.ManagerialApproval,
      job.data.createdBy as any,
      true,
    );

    // await this.purchasingService.setStatus(job.data.poId, job.data.status, job.data.actionBy);
    // Your job processing logic goes here
  }

  @Process(BullJobNames.ProcessFinanceApprovalJob)
  async handleFinanceApprovalJob(job: Job<PurchaseOrder>) {
    console.log('Processing job: - Finance Approval', job.id, job.data);

    const po = await this.purchaseOrderModel.findOne({
      _id: job.data._id,
    });

    if (!po) {
      throw new Error('PO not found');
    }

    await po.populate('owner');

    const org = po.owner;

    await po.populate('line_items');
    await po.populate('createdBy');

    if (!org) {
      throw new Error('Organization not found');
    }

    /// ---- AI STUFF HERE ----
    const aiResp = await this.processTemplate<{
      approved: boolean;
      reasoning: string;
      approvalStatus: string;
      nextSteps: string;
    }>(() => template(org, po), job);

    console.log('AI Response:', aiResp);

    if (aiResp.approved) {
      await this.purchasingService.setStatus(
        job.data._id,
        POStatus.FinanceApproval,
        job.data.createdBy as any,
        true,
        aiResp,
      );
    } else {
      // we want to just add a note to the po and then reject it
      await this.purchasingService.setStatus(
        job.data._id,
        POStatus.Rejected,
        job.data.createdBy as any,
        true,
        aiResp,
      );
    }
    // await this.purchasingService.setStatus(job.data.poId, job.data.status, job.data.actionBy);
    // Your job processing logic goes here
  }

  @Process(BullJobNames.ProcessComplianceReviewJob)
  async handleComplianceReviewJob(job: Job<PurchaseOrder>) {
    console.log('Processing job: - Compliance Review', job.id, job.data);

    await this.purchasingService.setStatus(
      job.data._id,
      POStatus.ComplianceReview,
      job.data.createdBy as any,
      true,
    );
    // await this.purchasingService.setStatus(job.data.poId, job.data.status, job.data.actionBy);
    // Your job processing logic goes here
  }

  @Process(BullJobNames.ProcessApprovalOrRejectionJob)
  async handleApprovalOrRejectionJob(job: Job<PurchaseOrder>) {
    console.log('Processing job: - Approval Or Rejection', job.id, job.data);

    await this.purchasingService.setStatus(
      job.data._id,
      POStatus.ApprovalOrRejection,
      job.data.createdBy as any,
      true,
    );
    // await this.purchasingService.setStatus(job.data.poId, job.data.status, job.data.actionBy);
    // Your job processing logic goes here
  }

  @Process(BullJobNames.ProcessSupplierEngagementJob)
  async handleSupplierEngagementJob(job: Job<PurchaseOrder>) {
    console.log(
      'ProcessSupplierEngagementJob: Will not auto approve this step.',
    );

    // await this.purchasingService.setStatus(job.data.poId, job.data.status, job.data.actionBy);
    // Your job processing logic goes here
  }

  @Process(BullJobNames.ProcessOrderFulfillmentJob)
  async handleOrderFulfillmentJob(job: Job<PurchaseOrder>) {
    console.log('ProcessOrderFulfillmentJob: Will not auto approve this step.');
    // In this step we are waiting on the order so this sits with the procurement officer until then
  }

  @Process(BullJobNames.ProcessInvoiceMatchingJob)
  async handleInvoiceMatchingJob(job: Job<PurchaseOrder>) {
    console.log('Processing job: - Invoice Matching', job.id, job.data);

    // Before this get's trigger we should have an invoice attached to the po so that this can be auto approved

    await this.purchasingService.setStatus(
      job.data._id,
      POStatus.InvoiceMatching,
      job.data.createdBy as any,
      true,
    );
  }

  @Process(BullJobNames.ProcessPaymentProcessingJob)
  async handlePaymentProcessingJob(job: Job<PurchaseOrder>) {
    console.log('Processing job: - Payment Processing', job.id, job.data);

    // This is a step that could be skipped for order of specific type and categories.

    await this.purchasingService.setStatus(
      job.data._id,
      POStatus.PaymentProcessing,
      job.data.createdBy as any,
      true,
    );
  }

  @Process(BullJobNames.ProcessOrderCloseoutJob)
  async handleOrderCloseoutJob(job: Job<PurchaseOrder>) {
    console.log('Processing job: - Order Closeout', job.id, job.data);

    // There is no reason this can't be auto approved

    await this.purchasingService.setStatus(
      job.data._id,
      POStatus.OrderCloseout,
      job.data.createdBy as any,
      true,
    );
  }

  @Process(BullJobNames.ProcessReportingAndAnalysisJob)
  async handleReportingAndAnalysisJob(job: Job<PurchaseOrder>) {
    console.log('Processing job: - Reporting', job.id, job.data);

    // simple re run out analytics reporting stuff here and then archive the order

    await this.purchasingService.setStatus(
      job.data._id,
      POStatus.ReportingAndAnalysis,
      job.data.createdBy as any,
      true,
    );
  }

  @Process(BullJobNames.ProcessArchiveJob)
  async handleArchiveJob(job: Job<PurchaseOrder>) {
    console.log('Processing job: - Archive', job.id, job.data);

    // We run out auto archiving process here

    await this.purchasingService.setStatus(
      job.data._id,
      POStatus.Archive,
      job.data.createdBy as any,
      true,
    );
  }

  @Process(BullJobNames.ProcessRejectedJob)
  async handleRejectedJob(job: Job<PurchaseOrder>) {
    console.log('Processing job: - Rejected', job.id, job.data);

    // We run out auto archiving process here

    // We should also send a notification to the requester that the order was rejected

    await this.purchasingService.setStatus(
      job.data._id,
      POStatus.Rejected,
      job.data.createdBy as any,
      true,
    );
  }

  @Process(BullJobNames.ProcessPOAmendmentJob)
  async handlePOAmendmentJob(job: Job<PurchaseOrder>) {
    console.log('ProcessPOAmendmentJob: Will not auto approve this step.');

    // This is a manual or an ai assisted but probably not auto approved step
  }

  @Process(BullJobNames.ProcessIssueResolutionJob)
  async handleIssueResolutionJob(job: Job<PurchaseOrder>) {
    console.log('ProcessIssueResolutionJob: Will not auto approve this step.');
    // something happend and we need to resolve it manually through contacting the supplier or the requester
  }
}
