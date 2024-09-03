import { Processor, Process } from '@nestjs/bull';
import Bull from 'bull';
import { Job } from 'bullmq';
import { BullJobNames, BullQueues } from '../entities/queue.entity';
import { PurchasingService } from 'src/purchasing/purchasing.service';

// Below is the logic for the PO status flow, we are going to create queue jobs for each step in the process

// switch (status) {
//     case POStatus.Draft:
//       // This is Approved by the requester
//       // send notification to the next approver
//       break;
//     case POStatus.RequisitionApproval:
//       // This is approved by the department manager
//       // send notification to the next approver
//       break;
//     case POStatus.ManagerialApproval:
//       // This is approval by the Senior Manager
//       // send notification to the next approver
//       break;
//     case POStatus.FinanceApproval: // we will try to ai approve the PO
//       // this is aprove by the finance controller
//       // try to AI approve the PO
//       break;
//     case POStatus.ComplianceReview: // we will try to ai approve the PO
//       // this is a review by the compliance officer
//       // try to AI approve the PO
//       break;
//     case POStatus.ApprovalOrRejection: // we will try to ai approve the PO
//       // this happens after the compliance review and finance and it gets sent back to the senior manager to send to the procurement officer
//       // send notification to the next approver
//       break;
//     case POStatus.SupplierEngagement:
//       // this is submittial to the supplier by the procurement officer
//       // send notification to the next approver
//       break;
//     case POStatus.OrderFulfillment:
//       // the procurement officer is waiting for the supplier to fulfill the order if they do not then it get sent back for supplier engagement (also the procurement officer) to handle
//       // send notification to the next approver
//       break;
//     case POStatus.InvoiceMatching: // we will try to ai approve the PO
//       // the procurement officer is waiting for the supplier to send the invoice
//       // if they do not get the invoice, first they check if the order was fulfilled and received if not then it goes back to order fulfillment
//       // if they do not get the invoice and the order was fulfilled then it goes back to issue resolution
//       // if they do get the invoice and they did not receive the order then it goes back to issue resolution
//       // if they do get the invoice and it does not match the order then it goes back to issue resolution
//       // if they do get the invoice and it matches the order then they send it to payment processing
//       // send notification to the next approver
//       break;
//     case POStatus.PaymentProcessing: // we will try to ai approve the PO
//       // the accounts payable office is about to pay the supplier
//       // shouldnt ever have to fo back to the other steps but just in case we will allow it here.
//       // send notification to the next approver
//       break;
//     case POStatus.OrderCloseout: // we will try to ai approve the PO
//       // by this point the order has been paid for and the procurement officer is closing out the order and sending it to reporting and analysis
//       // send notification to the next approver
//       break;
//     case POStatus.ReportingAndAnalysis: // we will try to ai approve the PO
//       // the procurement officer is analyzing the order for trends, performance, and opportunities and then archiving the order
//       // send notification to the next approver
//       break;
//     case POStatus.Archive: // we will try to ai approve the PO
//       // the compliance officer is archiving the order and related documents for future reference and the process is complete
//       // send notification to the next approver
//       break;
//     case POStatus.Rejected: // we will try to ai approve the PO
//       // this is when the order is rejected and needs review or cancellation by the requester
//       // send notification to the next approver
//       break;
//     case POStatus.POAmendment: // we will try to ai approve the PO
//       // this is when the order needs to be amended based on feedback from the supplier by the procurement officer
//       // send notification to the next approver
//       break;
//     case POStatus.IssueResolution: // we will try to ai approve the PO
//       // this is when the procurement officer is addressing any discrepancies or issues with the order or payment and then sending it back to order fulfillment, invoice matching, or payment processing
//       // send notification to the next approver
//       break;
//     default:
//       break;
//   }


@Processor(BullQueues.RIGU_QUEUE)
export class RiguQConsumer {
  // return this.purchasingService.setStatus(poId, status, user);
  constructor(
    private readonly purchasingService: PurchasingService,
  ) {}

  @Process(BullJobNames.RIGU_JOB)
  async handleJob(job: Job) {
    console.log('Processing job:', job.id, job.data);
    // await this.purchasingService.setStatus(job.data.poId, job.data.status, job.data.actionBy);
    // Your job processing logic goes here
  }

  @Process(BullJobNames.ProcessDraftJob)
  async handleDraftJob(job: Job) {
    console.log('Processing job:', job.id, job.data);
    // await this.purchasingService.setStatus(job.data.poId, job.data.status, job.data.actionBy);
    // Your job processing logic goes here
  }

  @Process(BullJobNames.ProcessRequisitionApprovalJob)
  async handleRequisitionApprovalJob(job: Job) {
    console.log('Processing job:', job.id, job.data);
    // await this.purchasingService.setStatus(job.data.poId, job.data.status, job.data.actionBy);
    // Your job processing logic goes here
  }

  @Process(BullJobNames.ProcessManagerialApprovalJob)
  async handleManagerialApprovalJob(job: Job) {
    console.log('Processing job:', job.id, job.data);
    // await this.purchasingService.setStatus(job.data.poId, job.data.status, job.data.actionBy);
    // Your job processing logic goes here
  }

  @Process(BullJobNames.ProcessFinanceApprovalJob)
  async handleFinanceApprovalJob(job: Job) {
    console.log('Processing job:', job.id, job.data);
    // await this.purchasingService.setStatus(job.data.poId, job.data.status, job.data.actionBy);
    // Your job processing logic goes here
  }

  @Process(BullJobNames.ProcessComplianceReviewJob)
  async handleComplianceReviewJob(job: Job) {
    console.log('Processing job:', job.id, job.data);
    // await this.purchasingService.setStatus(job.data.poId, job.data.status, job.data.actionBy);
    // Your job processing logic goes here
  }

  @Process(BullJobNames.ProcessApprovalOrRejectionJob)
  async handleApprovalOrRejectionJob(job: Job) {
    console.log('Processing job:', job.id, job.data);
    // await this.purchasingService.setStatus(job.data.poId, job.data.status, job.data.actionBy);
    // Your job processing logic goes here
  }

  @Process(BullJobNames.ProcessSupplierEngagementJob)
  async handleSupplierEngagementJob(job: Job) {
    console.log('Processing job:', job.id, job.data);
    // await this.purchasingService.setStatus(job.data.poId, job.data.status, job.data.actionBy);
    // Your job processing logic goes here
  }

  @Process(BullJobNames.ProcessOrderFulfillmentJob)
  async handleOrderFulfillmentJob(job: Job) {
    console.log('Processing job:', job.id, job.data);
    // await this.purchasingService.setStatus(job.data.poId, job.data.status, job.data.actionBy);
    // Your job processing logic goes here
  }

  @Process(BullJobNames.ProcessInvoiceMatchingJob)
  async handleInvoiceMatchingJob(job: Job) {
    console.log('Processing job:', job.id, job.data);
    // await this.purchasingService.setStatus(job.data.poId, job.data.status, job.data.actionBy);
    // Your job processing logic goes here
  }

  @Process(BullJobNames.ProcessPaymentProcessingJob)
  async handlePaymentProcessingJob(job: Job) {
    console.log('Processing job:', job.id, job.data);
    // await this.purchasingService.setStatus(job.data.poId, job.data.status, job.data.actionBy);
    // Your job processing logic goes here
  }

  @Process(BullJobNames.ProcessOrderCloseoutJob)
  async handleOrderCloseoutJob(job: Job) {
    console.log('Processing job:', job.id, job.data);
    // await this.purchasingService.setStatus(job.data.poId, job.data.status, job.data.actionBy);
    // Your job processing logic goes here
  }

  @Process(BullJobNames.ProcessReportingAndAnalysisJob)
  async handleReportingAndAnalysisJob(job: Job) {
    console.log('Processing job:', job.id, job.data);
    // await this.purchasingService.setStatus(job.data.poId, job.data.status, job.data.actionBy);
    // Your job processing logic goes here
  }

  @Process(BullJobNames.ProcessArchiveJob)
  async handleArchiveJob(job: Job) {
    console.log('Processing job:', job.id, job.data);
    // await this.purchasingService.setStatus(job.data.poId, job.data.status, job.data.actionBy);
    // Your job processing logic goes here
  }

  @Process(BullJobNames.ProcessRejectedJob)
  async handleRejectedJob(job: Job) {
    console.log('Processing job:', job.id, job.data);
    // await this.purchasingService.setStatus(job.data.poId, job.data.status, job.data.actionBy);
    // Your job processing logic goes here
  }

  @Process(BullJobNames.ProcessPOAmendmentJob)
  async handlePOAmendmentJob(job: Job) {
    console.log('Processing job:', job.id, job.data);
    // await this.purchasingService.setStatus(job.data.poId, job.data.status, job.data.actionBy);
    // Your job processing logic goes here
  }

  @Process(BullJobNames.ProcessIssueResolutionJob)
  async handleIssueResolutionJob(job: Job) {
    console.log('Processing job:', job.id, job.data);
    // await this.purchasingService.setStatus(job.data.poId, job.data.status, job.data.actionBy);
    // Your job processing logic goes here
  }
}
