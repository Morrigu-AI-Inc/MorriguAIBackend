export class Queue {}

export enum BullQueues {
  RIGU_QUEUE = 'rigu-queue',
}


export enum BullJobNames { 
  RIGU_JOB = 'rigu-job',
  ProcessDraftJob = 'process-draft-job',
  ProcessRequisitionApprovalJob = 'process-requisition-approval-job',
  ProcessManagerialApprovalJob = 'process-managerial-approval-job',
  ProcessFinanceApprovalJob = 'process-finance-approval-job',
  ProcessComplianceReviewJob = 'process-compliance-review-job',
  ProcessApprovalOrRejectionJob = 'process-approval-or-rejection-job',
  ProcessSupplierEngagementJob = 'process-supplier-engagement-job',
  ProcessOrderFulfillmentJob = 'process-order-fulfillment-job',
  ProcessInvoiceMatchingJob = 'process-invoice-matching-job',
  ProcessPaymentProcessingJob = 'process-payment-processing-job',
  ProcessOrderCloseoutJob = 'process-order-closeout-job',
  ProcessReportingAndAnalysisJob = 'process-reporting-and-analysis-job',
  ProcessArchiveJob = 'process-archive-job',
  ProcessRejectedJob = 'process-rejected-job',
  ProcessPOAmendmentJob = 'process-po-amendment-job',
  ProcessIssueResolutionJob = 'process-issue-resolution-job',
  

}