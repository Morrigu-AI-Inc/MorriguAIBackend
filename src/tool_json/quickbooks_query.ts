export const quickbooks_query = {
  type: 'function',
  function: {
    name: 'quickbooks_query',
    description:
      'This tool is only use for querying QuickBooks Account, Bill, CompanyInfo, Customer, Employee, Estimate, Invoice, Item, Payment, Preferences, ProfitAndLoss, TaxAgency, Vendor only.',
    parameters: {
      type: 'object',
      properties: {
        select: {
          type: 'string',
          description:
            'Specifies the fields to be retrieved from the selected QuickBooks resource. When using this parameter you must be very specific you should only get what you need and recall the tool to return additional fields.',
        },
        from: {
          type: 'string',
          enum: [
            'Account',
            'Bill',
            'CompanyInfo',
            'Customer',
            'Employee',
            'Estimate',
            'Invoice',
            'Item',
            'Payment',
            'Preferences',
            'TaxAgency',
            'Vendor',
          ],
        },
        where: {
          type: 'string',
          description:
            'Defines the filtering criteria to narrow down the results in the query.',
        },
        maxlimit: {
          type: 'integer',
          description:
            'Sets the maximum number of records to return in a single query. Default is set to 5 to ensure performance and manageability.',
        },
      },
      required: ['select', 'from'],
    },
  },
};
