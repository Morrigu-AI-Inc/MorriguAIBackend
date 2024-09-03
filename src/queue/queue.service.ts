import { Injectable } from '@nestjs/common';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import { BullJobNames, BullQueues } from './entities/queue.entity';

// @Injectable()
// export class MyService {
//   constructor(@InjectQueue('my-queue') private myQueue: Queue) {}  // The name must match

//   async addJob(data: any) {
//     await this.myQueue.add('my-job', data);
//   }
// }
@Injectable()
export class QueueService {
  // export enum BullJobNames {
  //   RIGU_JOB = 'rigu-job',
  //   ProcessDraftJob = 'process-draft-job',
  //   ProcessRequisitionApprovalJob = 'process-requisition-approval-job',
  //   ProcessManagerialApprovalJob = 'process-managerial-approval-job',
  //   ProcessFinanceApprovalJob = 'process-finance-approval-job',
  //   ProcessComplianceReviewJob = 'process-compliance-review-job',
  //   ProcessApprovalOrRejectionJob = 'process-approval-or-rejection-job',
  //   ProcessSupplierEngagementJob = 'process-supplier-engagement-job',
  //   ProcessOrderFulfillmentJob = 'process-order-fulfillment-job',
  //   ProcessInvoiceMatchingJob = 'process-invoice-matching-job',
  //   ProcessPaymentProcessingJob = 'process-payment-processing-job',
  //   ProcessOrderCloseoutJob = 'process-order-closeout-job',
  //   ProcessReportingAndAnalysisJob = 'process-reporting-and-analysis-job',
  //   ProcessArchiveJob = 'process-archive-job',
  //   ProcessRejectedJob = 'process-rejected-job',
  //   ProcessPOAmendmentJob = 'process-po-amendment-job',
  //   ProcessIssueResolutionJob = 'process-issue-resolution-job',
  // }
  
  private queues: Record<BullQueues, any>;
    [BullQueues.RIGU_QUEUE]: {
      name: BullQueues.RIGU_QUEUE,
      jobs: {
        [BullJobNames.RIGU_JOB]: {
          name: BullJobNames.RIGU_JOB,
          queue: any,
        },
        [BullJobNames.ProcessDraftJob]: {
          name: BullJobNames.ProcessDraftJob,
          queue: any,
        },
        [BullJobNames.ProcessRequisitionApprovalJob]: {
          name: BullJobNames.ProcessRequisitionApprovalJob,
          queue: any,
        },
        [BullJobNames.ProcessManagerialApprovalJob]: {
          name: BullJobNames.ProcessManagerialApprovalJob,
          queue: any,
        },
        [BullJobNames.ProcessFinanceApprovalJob]: {
          name: BullJobNames.ProcessFinanceApprovalJob,
          queue: any,
        },
        [BullJobNames.ProcessComplianceReviewJob]: {
          name: BullJobNames.ProcessComplianceReviewJob,
          queue: any,
        },
        [BullJobNames.ProcessApprovalOrRejectionJob]: {
          name: BullJobNames.ProcessApprovalOrRejectionJob,
          queue: any,
        },
        [BullJobNames.ProcessSupplierEngagementJob]: {
          name: BullJobNames.ProcessSupplierEngagementJob,
          queue: any,
        },
        [BullJobNames.ProcessOrderFulfillmentJob]: {
          name: BullJobNames.ProcessOrderFulfillmentJob,
          queue: any,
        },
        [BullJobNames.ProcessInvoiceMatchingJob]: {
          name: BullJobNames.ProcessInvoiceMatchingJob,
          queue: any,
        },
        [BullJobNames.ProcessPaymentProcessingJob]: {
          name: BullJobNames.ProcessPaymentProcessingJob,
          queue: any,
        },
        [BullJobNames.ProcessOrderCloseoutJob]: {
          name: BullJobNames.ProcessOrderCloseoutJob,
          queue: any,
        },
        [BullJobNames.ProcessReportingAndAnalysisJob]: {
          name: BullJobNames.ProcessReportingAndAnalysisJob,
          queue: any,
        },
        [BullJobNames.ProcessArchiveJob]: {
          name: BullJobNames.ProcessArchiveJob,
          queue: any,
        },
        [BullJobNames.ProcessRejectedJob]: {
          name: BullJobNames.ProcessRejectedJob,
          queue: any,
        },
        [BullJobNames.ProcessPOAmendmentJob]: {
          name: BullJobNames.ProcessPOAmendmentJob,
          queue: any,
        },
        [BullJobNames.ProcessIssueResolutionJob]: {
          name: BullJobNames.ProcessIssueResolutionJob,
          queue: any,
        }
      },
    };
  
  
  constructor(@InjectQueue(BullQueues.RIGU_QUEUE) private rQueue: Queue) {  
    this.queues = {
      [BullQueues.RIGU_QUEUE]: {
        name: BullQueues.RIGU_QUEUE,
        jobs: {
          [BullJobNames.RIGU_JOB]: {
            name: BullJobNames.RIGU_JOB,
            queue: rQueue,
          },
          [BullJobNames.ProcessDraftJob]: {
            name: BullJobNames.ProcessDraftJob,
            queue: rQueue,
          },
          [BullJobNames.ProcessRequisitionApprovalJob]: {
            name: BullJobNames.ProcessRequisitionApprovalJob,
            queue: rQueue,
          },
          [BullJobNames.ProcessManagerialApprovalJob]: {
            name: BullJobNames.ProcessManagerialApprovalJob,
            queue: rQueue,
          },
          [BullJobNames.ProcessFinanceApprovalJob]: {
            name: BullJobNames.ProcessFinanceApprovalJob,
            queue: rQueue,
          },
          [BullJobNames.ProcessComplianceReviewJob]: {
            name: BullJobNames.ProcessComplianceReviewJob,
            queue: rQueue,
          },
          [BullJobNames.ProcessApprovalOrRejectionJob]: {
            name: BullJobNames.ProcessApprovalOrRejectionJob,
            queue: rQueue,
          },
          [BullJobNames.ProcessSupplierEngagementJob]: {
            name: BullJobNames.ProcessSupplierEngagementJob,
            queue: rQueue,
          },
          [BullJobNames.ProcessOrderFulfillmentJob]: {
            name: BullJobNames.ProcessOrderFulfillmentJob,
            queue: rQueue,
          },
          [BullJobNames.ProcessInvoiceMatchingJob]: {
            name: BullJobNames.ProcessInvoiceMatchingJob,
            queue: rQueue,
          },
          [BullJobNames.ProcessPaymentProcessingJob]: {
            name: BullJobNames.ProcessPaymentProcessingJob,
            queue: rQueue,
          },
          [BullJobNames.ProcessOrderCloseoutJob]: {
            name: BullJobNames.ProcessOrderCloseoutJob,
            queue: rQueue,
          },
          [BullJobNames.ProcessReportingAndAnalysisJob]: {
            name: BullJobNames.ProcessReportingAndAnalysisJob,
            queue: rQueue,
          },
          [BullJobNames.ProcessArchiveJob]: {
            name: BullJobNames.ProcessArchiveJob,
            queue: rQueue,
          },
          [BullJobNames.ProcessRejectedJob]: {
            name: BullJobNames.ProcessRejectedJob,
            queue: rQueue,
          },
          [BullJobNames.ProcessPOAmendmentJob]: {
            name: BullJobNames.ProcessPOAmendmentJob,
            queue: rQueue,
          },
          [BullJobNames.ProcessIssueResolutionJob]: {
            name: BullJobNames.ProcessIssueResolutionJob,
            queue: rQueue,
          }
        },
      },
    };
  }
  
  async addJob(data: any, queue: BullQueues, job: BullJobNames) {

    if(!this.queues[queue]) {
      throw new Error(`Queue ${queue} not found`);
    }

    if(!this.queues[queue].jobs[job]) {
      throw new Error(`Job ${job} not found in queue ${queue}`);
    }

    await this.queues[queue].jobs[job].queue.add(job, data);
  }
  

  create(createQueueDto: CreateQueueDto) {
    return 'This action adds a new queue';
  }

  findAll() {
    return `This action returns all queue`;
  }

  findOne(id: number) {
    return `This action returns a #${id} queue`;
  }

  update(id: number, updateQueueDto: UpdateQueueDto) {
    return `This action updates a #${id} queue`;
  }

  remove(id: number) {
    return `This action removes a #${id} queue`;
  }
}
