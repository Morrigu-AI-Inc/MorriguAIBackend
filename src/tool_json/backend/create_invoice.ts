const create_invoice = {
  type: 'function',
  function: {
    name: 'create_invoice',
    description: 'Create an invoice for the given customer.',
    parameters: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      type: 'object',
      required: ['CustomerRef', 'Line'],
      properties: {
        CustomerRef: {
          type: 'object',
          required: ['value', 'name'],
          properties: {
            value: {
              type: 'string',
              description:
                'Unique identifier for the customer. This is the Customer.Id obtained from querying the Customer name list resource.',
            },
            name: {
              type: 'string',
              description:
                'Display name of the customer. This is the Customer.DisplayName from the customer object.',
            },
          },
          description:
            'Reference to a customer or job. Required to link the invoice to a specific customer.',
        },
        Line: {
          type: 'array',
          minItems: 1,
          items: {
            oneOf: [
              {
                $ref: '#/definitions/SalesItemLine',
              },
              {
                $ref: '#/definitions/GroupLine',
              },
              {
                $ref: '#/definitions/DescriptionOnlyLine',
              },
            ],
          },
          description:
            'List of line items for the invoice. Must include at least one line item from the defined options.',
        },
        CurrencyRef: {
          type: 'object',
          properties: {
            value: {
              type: 'string',
              description:
                'Currency code in which all transaction amounts are expressed. Example values: USD, EUR.',
            },
          },
          required: ['value'],
          description:
            'Reference to the currency used in the invoice. Conditionally required if the company has multicurrency support enabled.',
        },
        ProjectRef: {
          type: 'object',
          properties: {
            value: {
              type: 'string',
              description:
                'Identifier for the project associated with this transaction. It is required if transactions are tracked by projects.',
            },
          },
          description:
            'Optional. Provides a reference to a project ID associated with this transaction, applicable for versions 69 and above.',
        },
      },
      definitions: {
        SalesItemLine: {
          type: 'object',
          required: ['itemId', 'quantity', 'unitPrice'],
          properties: {
            itemId: {
              type: 'string',
              description: 'Identifier of the item being sold.',
            },
            quantity: {
              type: 'number',
              description:
                'Quantity of the item sold. Must be a positive number.',
            },
            unitPrice: {
              type: 'number',
              description: 'Unit price of the item. Must be a positive number.',
            },
            description: {
              type: 'string',
              description: 'A brief description of the item.',
            },
          },
        },
        GroupLine: {
          type: 'object',
          properties: {
            groupId: {
              type: 'string',
              description:
                'Identifier for a group of items or services sold together.',
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                required: ['itemId', 'quantity'],
                properties: {
                  itemId: {
                    type: 'string',
                    description: 'Identifier of each item within the group.',
                  },
                  quantity: {
                    type: 'number',
                    description: 'Quantity of each item within the group.',
                  },
                },
              },
            },
            description: {
              type: 'string',
              description: 'Description of the group line.',
            },
          },
        },
        DescriptionOnlyLine: {
          type: 'object',
          properties: {
            description: {
              type: 'string',
              description:
                'A description of the line item, used when no specific item is being transacted, such as for subtotals or notes.',
            },
          },
        },
      },
    },
  },
};

export default create_invoice;
