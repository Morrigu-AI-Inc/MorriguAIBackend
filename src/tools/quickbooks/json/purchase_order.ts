const purchase_order_schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'PurchaseOrder',
  type: 'object',
  properties: {
    TotalAmt: {
      type: 'number',
    },
    Line: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          DetailType: {
            type: 'string',
          },
          Amount: {
            type: 'number',
          },
          ProjectRef: {
            type: 'object',
            properties: {
              value: {
                type: 'string',
              },
            },
            required: ['value'],
          },
          Id: {
            type: 'string',
          },
          ItemBasedExpenseLineDetail: {
            type: 'object',
            properties: {
              ItemRef: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                  },
                  value: {
                    type: 'string',
                  },
                },
                required: ['name', 'value'],
              },
              CustomerRef: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                  },
                  value: {
                    type: 'string',
                  },
                },
                required: ['name', 'value'],
              },
              Qty: {
                type: 'number',
              },
              TaxCodeRef: {
                type: 'object',
                properties: {
                  value: {
                    type: 'string',
                  },
                },
                required: ['value'],
              },
              BillableStatus: {
                type: 'string',
              },
              UnitPrice: {
                type: 'number',
              },
            },
            required: [
              'ItemRef',
              'CustomerRef',
              'Qty',
              'TaxCodeRef',
              'BillableStatus',
              'UnitPrice',
            ],
          },
        },
        required: [
          'DetailType',
          'Amount',
          'ProjectRef',
          'Id',
          'ItemBasedExpenseLineDetail',
        ],
      },
    },
    APAccountRef: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
      required: ['name', 'value'],
    },
    VendorRef: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
      required: ['name', 'value'],
    },
    ShipTo: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        value: {
          type: 'string',
        },
      },
      required: ['name', 'value'],
    },
  },
  required: ['TotalAmt', 'Line', 'APAccountRef', 'VendorRef', 'ShipTo'],
};