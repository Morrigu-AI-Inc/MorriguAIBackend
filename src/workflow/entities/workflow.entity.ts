export class Workflow {}
// requester = 'requester',
// departmentManager = 'departmentManager',
// seniorManager = 'seniorManager',
// financeController = 'financeController',
// complianceOfficer = 'complianceOfficer',
// procurementOfficer = 'procurementOfficer',
// accountsPayable = 'accountsPayable',
/// Org Stucture

type Root = {
    name: string;
    teams: Team[];
    managerId: string;
    seniorManagerId: string;
    ownerGroup: Group;
    financeGroup: Group;
    complianceGroup: Group;
    procurementGroup: Group;
    accountsPayableGroup: Group;
}

type Group = {
    name: string;
    users: string[];
    acl?: any;
}

type Team = {
    managerId: string;
    seniorManagerId: string;
    users: string[];
    parentTeam: Team;
    financeGroup?: Group;
    complianceGroup?: Group;
    procurementGroup?: Group;
    accountsPayableGroup?: Group;
    acl?: any;
}


// For eacb role, we need to know the group that is responsible for approving the PO
// requester is simply the user who created the PO
// departmentManager is the manager of the team that the requester belongs to
// seniorManager is the seniorManager of the team that the requester belongs to
// financeController is anyone in the financeGroup of the team that the requester belongs to
//     if there is no financeGroup, then it is the financeGroup of the parent team
//          this continues until we reach a team with a financeGroup or the root team
// complianceOfficer is anyone in the complianceGroup of the team that the requester belongs to
//      if there is no complianceGroup, then it is the complianceGroup of the parent team
//          this continues until we reach a team with a complianceGroup or the root team
// procurementOfficer is anyone in the procurementGroup of the team that the requester belongs to
//      if there is no procurementGroup, then it is the procurementGroup of the parent team
//          this continues until we reach a team with a procurementGroup or the root team
// accountsPayable is anyone in the accountsPayableGroup of the team that the requester belongs to
//      if there is no accountsPayableGroup, then it is the accountsPayableGroup of the parent team
//          this continues until we reach a team with a accountsPayableGroup or the root team

/// Workflow Entities

export enum POStatus {
  Draft = 'Draft',
  RequisitionApproval = 'RequisitionApproval',
  ManagerialApproval = 'ManagerialApproval',
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

export interface WorkflowStep {
  name: POStatus;
  description: string;
  nextSteps: POStatus[];
  approverRole: WorkFlowRoles;
  label: string;
  color: string;
  autoMode?: boolean;
  autoAction?: POStatus | null;
}

export enum WorkFlowRoles {
  requester = 'requester',
  departmentManager = 'departmentManager',
  seniorManager = 'seniorManager',
  financeController = 'financeController',
  complianceOfficer = 'complianceOfficer',
  procurementOfficer = 'procurementOfficer',
  accountsPayable = 'accountsPayable',
}

export const poWorkflow: { [key in POStatus]: WorkflowStep } = {
  // Step 1: Draft Creation (Initial state, no auto mode)
  [POStatus.Draft]: {
    name: POStatus.Draft,
    label: 'Draft',
    color: 'info',
    description:
      'The PO is created and saved as a draft. It can be edited before moving forward.',
    nextSteps: [POStatus.RequisitionApproval],
    approverRole: WorkFlowRoles.requester, // No approval yet, just in draft
    autoMode: false, // User manually submits the PO for approval
    autoAction: null,
  },

  // Step 2: Requisition Approval (Requestor submits the PO)
  [POStatus.RequisitionApproval]: {
    name: POStatus.RequisitionApproval,
    label: 'Requisition Approval',
    color: 'primary',
    description: 'The requester submits the PO for approval.',
    nextSteps: [POStatus.ManagerialApproval, POStatus.Rejected],
    approverRole: WorkFlowRoles.requester, // Department manager needs to approve
    autoMode: false, // Manual approval required
    autoAction: null,
  },

  // Step 3: Managerial Approval
  [POStatus.ManagerialApproval]: {
    name: POStatus.ManagerialApproval,
    label: 'Managerial Approval',
    color: 'primary',
    description: 'Approval by one or more managers or department heads.',
    nextSteps: [
      POStatus.FinanceApproval,
      POStatus.RequisitionApproval,
      POStatus.Rejected,
    ],
    approverRole: WorkFlowRoles.departmentManager, // Senior manager of requester's team
    autoMode: true, // Auto mode can move to the next step
    autoAction: POStatus.FinanceApproval,
  },

  // Step 4: Finance Approval
  [POStatus.FinanceApproval]: {
    name: POStatus.FinanceApproval,
    label: 'Finance Approval',
    color: 'primary',
    description: 'Review and approval by the finance department.',
    nextSteps: [
      POStatus.ComplianceReview, 
      POStatus.ManagerialApproval,
      POStatus.Rejected,
    ],
    approverRole: WorkFlowRoles.financeController,
    autoMode: true, // AI will attempt to approve
    autoAction: POStatus.ComplianceReview
  },

  // Step 5: Compliance Review
  [POStatus.ComplianceReview]: {
    name: POStatus.ComplianceReview,
    label: 'Compliance Review',
    color: 'info',
    description: 'Review by the compliance or legal teams.',
    nextSteps: [
      POStatus.ApprovalOrRejection, 
      POStatus.FinanceApproval,
      POStatus.Rejected,
    ],
    approverRole: WorkFlowRoles.complianceOfficer,
    autoMode: true, // AI will attempt to approve
    autoAction: POStatus.ApprovalOrRejection
  },

  // Step 6: Approval or Rejection
  [POStatus.ApprovalOrRejection]: {
    name: POStatus.ApprovalOrRejection,
    label: 'Approval or Rejection',
    color: 'info',
    description: 'Final decision to approve or reject the PO.',
    nextSteps: [
      POStatus.SupplierEngagement,
      POStatus.RequisitionApproval,
      POStatus.Rejected,
    ],
    approverRole: WorkFlowRoles.seniorManager,
    autoMode: true, // AI will attempt to approve or it goes to the senior manager for approval
    autoAction: POStatus.SupplierEngagement
  },

  // Step 7: Supplier Engagement (No auto mode, manual process)
  [POStatus.SupplierEngagement]: {
    name: POStatus.SupplierEngagement,
    label: 'Supplier Engagement',
    color: 'secondary',
    description: 'Submission of the PO to the supplier and confirmation.',
    nextSteps: [
      POStatus.OrderFulfillment,
      POStatus.ApprovalOrRejection,
      POStatus.POAmendment,
    ],
    approverRole: WorkFlowRoles.procurementOfficer,
    autoMode: false, // Manual engagement required maybe can be automated
  },

  // Step 8: Order Fulfillment (No auto mode)
  [POStatus.OrderFulfillment]: {
    name: POStatus.OrderFulfillment,
    label: 'Order Fulfillment',
    color: 'success',
    description: 'Supplier delivers goods/services as per the PO.',
    nextSteps: [
      POStatus.InvoiceMatching,
      POStatus.SupplierEngagement,
      POStatus.IssueResolution,
    ],
    approverRole: WorkFlowRoles.procurementOfficer,
    autoMode: false, // Manual process // waiting will move to complete when Invoice is matched, payment is processed, and goods are received
  },

  // Step 9: Invoice Matching and Payment
  [POStatus.InvoiceMatching]: {
    name: POStatus.InvoiceMatching,
    label: 'Invoice Matching and Payment',
    color: 'info',
    description:
      'Matching the invoice with the PO and receiving the goods/services.',
    nextSteps: [
      POStatus.PaymentProcessing,
      POStatus.OrderFulfillment,
      POStatus.IssueResolution,
    ],
    approverRole: WorkFlowRoles.accountsPayable,
    autoMode: false, // Manual check required // waiting 
  },

  // Step 10: Payment Processing
  [POStatus.PaymentProcessing]: {
    name: POStatus.PaymentProcessing,
    label: 'Payment Processing',
    color: 'success',
    description:
      'Processing payment to the supplier according to payment terms.',
    nextSteps: [
      POStatus.OrderCloseout,
      POStatus.InvoiceMatching,
      POStatus.IssueResolution,
    ],
    approverRole: WorkFlowRoles.accountsPayable,
    autoMode: false, // Manual process
  },

  // Step 11: Order Closeout
  [POStatus.OrderCloseout]: {
    name: POStatus.OrderCloseout,
    label: 'Order Closeout',
    color: 'success',
    description: 'Finalizing and closing the PO after payment is made.',
    nextSteps: [POStatus.ReportingAndAnalysis],
    approverRole: WorkFlowRoles.procurementOfficer,
    autoMode: true, // Can be automated
    autoAction: POStatus.ReportingAndAnalysis
  },

  // Step 12: Reporting and Analysis
  [POStatus.ReportingAndAnalysis]: {
    name: POStatus.ReportingAndAnalysis,
    label: 'Reporting and Analysis',
    color: 'info',
    description:
      'Analysis of the PO for trends, performance, and opportunities.',
    nextSteps: [POStatus.Archive],
    approverRole: WorkFlowRoles.procurementOfficer,
    autoMode: true, // Can be automated
    autoAction: POStatus.Archive
  },

  // Step 13: Archive
  [POStatus.Archive]: {
    name: POStatus.Archive,
    label: 'Archive',
    color: 'info',
    description: 'Archiving the PO and related documents for future reference.',
    nextSteps: [],
    approverRole: WorkFlowRoles.procurementOfficer, // Final archive approval by compliance officer
    autoMode: false, // this is the end
  },

  // Rejected Step
  [POStatus.Rejected]: {
    name: POStatus.Rejected,
    label: 'Rejected',
    color: 'error',
    description:
      'The PO or requisition has been rejected and needs review or cancellation.',
    nextSteps: [POStatus.Draft], // Go back to draft if needed
    approverRole: WorkFlowRoles.requester,
    autoMode: false, // Manual process to resubmit
  },

  // PO Amendment Step
  [POStatus.POAmendment]: {
    name: POStatus.POAmendment,
    label: 'PO Amendment',
    color: 'info',
    description: 'Amendment of the PO based on feedback from the supplier.',
    nextSteps: [POStatus.ApprovalOrRejection, POStatus.RequisitionApproval],
    approverRole: WorkFlowRoles.procurementOfficer,
    autoMode: false, // Manual amendment required
  },

  // Issue Resolution Step
  [POStatus.IssueResolution]: {
    name: POStatus.IssueResolution,
    label: 'Issue Resolution',
    color: 'warning',
    description:
      'Addressing any discrepancies or issues with the order or payment.',
    nextSteps: [
      POStatus.OrderFulfillment,
      POStatus.InvoiceMatching,
      POStatus.PaymentProcessing,
    ],
    approverRole: WorkFlowRoles.procurementOfficer,
    autoMode: false, // Manual resolution required
  },
};