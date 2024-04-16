import {
  accountSchema,
  billPaymentSchema,
  billSchema,
  budgetSchema,
  classSchema,
  creditMemoSchema,
  customerSchema,
  customerTypeSchema,
  deletedObjectsSchema,
  departmentSchema,
  depositSchema,
  employeeSchema,
  estimateSchema,
  invoiceSchema,
  itemSchema,
  journalEntrySchema,
  paymentMethodSchema,
  paymentSchema,
  profitLossReportSchema,
  purchaseOrderSchema,
  purchaseSchema,
  refundReceiptSchema,
  salesReceiptSchema,
  taxAgencySchema,
  taxCodeSchema,
  termSchema,
  timeActivitySchema,
  transferSchema,
  vendorCreditSchema,
  vendorSchema,
} from '../compiled_taps/tap-quickbooks/quickbooks';

const quickbooks_update = {
  type: 'function',
  function: {
    name: 'quickbooks_update_create_delete',
    description:
      'Update, create, or delete a QuickBooks entity such as: invoice, account, billPayment, bill, budget, class, creditMemo, customer, customerType, department, deletedObject, deposit, employee, estimate, item, journalEntry, paymentMethod, payment, profitLossReport, purchaseOrder, purchase, refundReceipt, salesReceipt, taxAgency, taxCode, term, timeActivity, transfer, vendorCredits, vendor.',
    parameters: {
      type: 'object',
      properties: {
        operation: {
          type: 'string',
          description: 'The operation to perform',
          enum: ['update', 'create', 'delete'],
        },
        entity: {
          type: 'string',
          description: 'The entity to perform the operation on.',
          enum: [
            'invoice',
            'account',
            'billPayment',
            'bill',
            'budget',
            'class',
            'credit_memo',
            'customer_type',
            'customer',
            'department',
            'deleted_object',
            'deposit',
            'employee',
            'estimate',
            'item',
            'journal_entry',
            'payment_method',
            'payment',
            'profit_loss_report',
            'purchase_order',
            'purchase',
            'refund_receipt',
            'sales_receipt',
            'tax_agency',
            'tax_code',
            'tax_rate',
            'term',
            'time_activity',
            'transfer',
            'vendor_credits',
            'vendor',
          ],
        },
        body: {
          type: 'object',
          description: 'The data to update the entity with',
          oneOf: [
            {
              entity: 'invoice',
              description:
                'Have at least one Line a sales item or inline subtotal. Have a populated CustomerRef element. CurrencyRef must be defined if multicurrency is enabled for the company. Multicurrency is enabled for the company if Preferences.MultiCurrencyEnabled is set to true.',
              ...invoiceSchema,
            },
            {
              entity: 'account',
              description:
                'Name must be unique. The Account.Name attribute must not contain double quotes (") or colon (:). The Account.AcctNum attribute must not contain a colon (:). ',
              ...accountSchema,
            },
            {
              entity: 'billpayment',
              ...billPaymentSchema,
            },
            {
              entity: 'bill',
              ...billSchema,
            },
            {
              entity: 'budget',
              description: `The Budget entity is used to create a budget for a fiscal year. The budget can be created for a specific customer, class, department`,
              ...budgetSchema,
            },
            {
              entity: 'class',
              ...classSchema,
            },
            {
              entity: 'credit_memo',
              ...creditMemoSchema,
            },
            {
              entity: 'customer',
              ...customerSchema,
            },
            {
              entity: 'customer_type',
              ...customerTypeSchema,
            },

            {
              entity: 'department',
              ...departmentSchema,
            },
            {
              entity: 'deleted_object',
              ...deletedObjectsSchema,
            },
            {
              entity: 'deposit',
              ...depositSchema,
            },
            {
              entity: 'employee',
              ...employeeSchema,
            },
            {
              entity: 'estimate',
              ...estimateSchema,
            },
            {
              entity: 'item',
              ...itemSchema,
            },
            {
              entity: 'journal_entry',
              ...journalEntrySchema,
            },
            {
              entity: 'payment_method',
              ...paymentMethodSchema,
            },
            {
              entity: 'payment',
              ...paymentSchema,
            },
            {
              entity: 'profit_loss_report',
              ...profitLossReportSchema,
            },
            {
              entity: 'purchase_order',
              ...purchaseOrderSchema,
            },
            {
              entity: 'purchase',
              ...purchaseSchema,
            },
            {
              entity: 'refund_receipt',
              ...refundReceiptSchema,
            },
            {
              entity: 'sales_receipt',
              ...salesReceiptSchema,
            },
            {
              entity: 'tax_agency',
              ...taxAgencySchema,
            },
            {
              entity: 'tax_code',
              ...taxCodeSchema,
            },
            {
              entity: 'term',
              ...termSchema,
            },
            {
              entity: 'time_activity',
              ...timeActivitySchema,
            },
            {
              entity: 'transfer',
              ...transferSchema,
            },
            {
              entity: 'vendor_credits',
              ...vendorCreditSchema,
            },
            {
              entity: 'vendor',
              description:
                'Either the DisplayName attribute or at least one of Title, GivenName, MiddleName, FamilyName, or Suffix attributes are required during create.',
              ...vendorSchema,
            },
          ],
        },
      },
      required: ['operation', 'entity', 'body'],
    },
  },
};

export default quickbooks_update;
