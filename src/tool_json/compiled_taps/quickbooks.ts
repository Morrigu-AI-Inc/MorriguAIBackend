import * as deref from 'json-schema-deref-sync';

import * as invoice_schema from 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas/invoices.json';
import * as accounts_schema from 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas/accounts.json';
import * as customers_schema from 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas/customers.json';
import * as item_schema from 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas/items.json';
import * as payments_schema from 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas/payments.json';
import * as vendor_schema from 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas/vendors.json';
import * as bill_payment_schema from 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas/bill_payments.json';
import * as bills_schema from 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas/bills.json';
import * as budget_schema from 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas/budgets.json';
import * as classes_schema from 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas/classes.json';
import * as credit_memo_schema from 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas/credit_memos.json';
import * as customer_type_schema from 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas/customer_types.json';
import * as deleted_objects_schema from 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas/deleted_objects.json';
import * as department_schema from 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas/departments.json';
import * as deposit_schema from 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas/deposits.json';
import * as employee_schema from 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas/employees.json';
import * as estimate_schema from 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas/estimates.json';
import * as journal_entry_schema from 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas/journal_entries.json';
import * as payment_method_schema from 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas/payment_methods.json';
import * as profit_loss_report_schema from 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas/profit_loss_report.json';
import * as purchase_order_schema from 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas/purchase_orders.json';
import * as purchase_schema from 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas/purchases.json';
import * as refund_receipt_schema from 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas/refund_receipts.json';
import * as sales_receipt_schema from 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas/sales_receipts.json';
import * as tax_agency_schema from 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas/tax_agencies.json';
import * as tax_code_schema from 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas/tax_codes.json';
import * as term_schema from 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas/terms.json';
import * as time_activity_schema from 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas/time_activities.json';
import * as transfer_schema from 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas/transfers.json';
import * as vendor_credit_schema from 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas/vendor_credits.json';

const deref_invoice = deref(invoice_schema, {
  baseFolder: 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas',
});

export const invoiceSchema = {
  type: 'object',
  required: ['CustomerRef', 'Line', 'CurrencyRef'],
  ...deref_invoice,
};

export const deref_account = deref(accounts_schema, {
  baseFolder: 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas',
});

export const accountSchema = {
  type: 'object',
  description:
    'Name must be unique. The Account.Name attribute must not contain double quotes (") or colon (:). The Account.AcctNum attribute must not contain a colon (:).',
  required: ['Id', 'Name', 'SyncToken', 'AcctNum'],
  ...deref_account,
};

export const deref_customer = deref(customers_schema, {
  baseFolder: 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas',
});

export const customerSchema = {
  type: 'object',
  description:
    'The DisplayName attribute or at least one of Title, GivenName, MiddleName, FamilyName, or Suffix attributes is required during object create.',
  required: [],
  ...deref_customer,
};

export const deref_item = deref(item_schema, {
  baseFolder: 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas',
});

export const itemSchema = {
  type: 'object',
  required: ['Name'],
  ...deref_item,
};

export const deref_payment = deref(payments_schema, {
  baseFolder: 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas',
});

export const paymentSchema = {
  type: 'object',
  required: ['TotalAmt', 'CustomerRef'],
  ...deref_payment,
};

export const deref_vendor = deref(vendor_schema, {
  baseFolder: 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas',
});

export const vendorSchema = {
  type: 'object',
  description:
    'Suffix, Title, MiddleName, and FamilyName, GivenName are conditionally required.',
  required: [],
  ...deref_vendor,
};

export const deref_bill_payment = deref(bill_payment_schema, {
  baseFolder: 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas',
});

export const billPaymentSchema = {
  type: 'object',
  description:
    'PayType must be either Check or CreditCard. CurrencyRef, CreditCardPayment, CheckPayment are conditionally required.',
  required: ['PayType'],
  ...deref_bill_payment,
};

export const deref_bill = deref(bills_schema, {
  baseFolder: 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas',
});

export const billSchema = {
  type: 'object',
  description:
    'Query the Vendor resource to determine the appropriate Vendor object for this reference. Use Vendor.Id for VendorRef. CurrencyRef is conditionally required',
  required: ['VendorRef', 'Line'],
  ...deref_bill,
};

export const deref_budget = deref(budget_schema, {
  baseFolder: 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas',
});

export const budgetSchema = {
  type: 'object',
  required: [],
  ...deref_budget,
};

export const deref_class = deref(classes_schema, {
  baseFolder: 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas',
});

export const classSchema = {
  type: 'object',
  required: [],
  ...deref_class,
};

export const deref_credit_memo = deref(credit_memo_schema, {
  baseFolder: 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas',
});

export const creditMemoSchema = {
  type: 'object',
  required: ['CustomerRef', 'Line'],
  ...deref_credit_memo,
};

export const deref_customer_type = deref(customer_type_schema, {
  baseFolder: 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas',
});

export const customerTypeSchema = {
  type: 'object',
  description:
    'The DisplayName attribute or at least one of Title, GivenName, MiddleName, FamilyName, or Suffix attributes is required during object create.',
  required: [],
  ...deref_customer_type,
};

export const deref_deleted_objects = deref(deleted_objects_schema, {
  baseFolder: 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas',
});

export const deletedObjectsSchema = {
  type: 'object',
  required: [],
  ...deref_deleted_objects,
};

export const deref_department = deref(department_schema, {
  baseFolder: 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas',
});

export const departmentSchema = {
  type: 'object',
  required: [],
  ...deref_department,
};

export const deref_deposit = deref(deposit_schema, {
  baseFolder: 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas',
});

export const depositSchema = {
  type: 'object',
  required: [],
  ...deref_deposit,
};

export const deref_employee = deref(employee_schema, {
  baseFolder: 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas',
});

export const employeeSchema = {
  type: 'object',
  description:
    'PrimaryAddr Represents the physical street address for this employee. If QuickBooks Payroll is enabled for the company, the following PhysicalAddress fields are required: City, maximum of 255 chars CountrySubDivisionCode, maximum of 255 chars PostalCode Required when QuickBooks Payroll is enabled. If a physical address is updated from within the transaction object, the QuickBooks Online API flows individual address components differently into the Line elements of the transaction response then when the transaction was first created: Line1 and Line2 elements are populated with the customer name and company name. Original Line1 through Line 5 contents, City, SubDivisionCode, and PostalCode flow into Line3 through Line5 as a free format strings.',
  required: [],
  ...deref_employee,
};

export const deref_estimate = deref(estimate_schema, {
  baseFolder: 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas',
});

export const estimateSchema = {
  type: 'object',
  description:
    'An Estimate must have at least one line that describes an item. An Estimate must have a reference to a customer. If shipping address and billing address are not provided, the address from the referenced Customer object is used.',
  required: ['Line', 'CustomerRef'],
  ...deref_estimate,
};

export const deref_journal_entry = deref(journal_entry_schema, {
  baseFolder: 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas',
});

export const journalEntrySchema = {
  type: 'object',
  required: [],
  ...deref_journal_entry,
};

export const deref_payment_method = deref(payment_method_schema, {
  baseFolder: 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas',
});

export const paymentMethodSchema = {
  type: 'object',
  required: [],
  ...deref_payment_method,
};

export const deref_profit_loss_report = deref(profit_loss_report_schema, {
  baseFolder: 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas',
});

export const profitLossReportSchema = {
  type: 'object',
  required: [],
  ...deref_profit_loss_report,
};

export const deref_purchase_order = deref(purchase_order_schema, {
  baseFolder: 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas',
});

export const purchaseOrderSchema = {
  type: 'object',
  required: [],
  ...deref_purchase_order,
};

export const deref_purchase = deref(purchase_schema, {
  baseFolder: 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas',
});

export const purchaseSchema = {
  type: 'object',
  required: [],
  ...deref_purchase,
};

export const deref_refund_receipt = deref(refund_receipt_schema, {
  baseFolder: 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas',
});

export const refundReceiptSchema = {
  type: 'object',
  required: [],
  ...deref_refund_receipt,
};

export const deref_sales_receipt = deref(sales_receipt_schema, {
  baseFolder: 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas',
});

export const salesReceiptSchema = {
  type: 'object',
  required: [],
  ...deref_sales_receipt,
};

export const deref_tax_agency = deref(tax_agency_schema, {
  baseFolder: 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas',
});

export const taxAgencySchema = {
  type: 'object',
  required: ['DisplayName'],
  ...deref_tax_agency,
};

export const deref_tax_code = deref(tax_code_schema, {
  baseFolder: 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas',
});

export const taxCodeSchema = {
  type: 'object',
  required: [],
  ...deref_tax_code,
};

export const deref_term = deref(term_schema, {
  baseFolder: 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas',
});

export const termSchema = {
  type: 'object',
  required: [],
  ...deref_term,
};

export const deref_time_activity = deref(time_activity_schema, {
  baseFolder: 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas',
});

export const timeActivitySchema = {
  type: 'object',
  required: [],
  ...deref_time_activity,
};

export const deref_transfer = deref(transfer_schema, {
  baseFolder: 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas',
});

export const transferSchema = {
  type: 'object',
  required: [],
  ...deref_transfer,
};

export const deref_vendor_credit = deref(vendor_credit_schema, {
  baseFolder: 'src/tool_json/taps/tap-quickbooks/tap_quickbooks/schemas',
});

export const vendorCreditSchema = {
  type: 'object',
  required: [],
  ...deref_vendor_credit,
};
