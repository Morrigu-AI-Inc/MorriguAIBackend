// "endpoint": {
//                     "type": "string",
//                     "enum": [
//                         "tools/product_entry"
//                     ]
//                 },
//                 "method": {
//                     "type": "string",
//                     "enum": [
//                         "POST"
//                     ]
//                 },
//                 "contentType": {
//                     "type": "string",
//                     "enum": [
//                         "application/json"
//                     ]
//                 },

type ToolEndpoint = {
  endpoint: {
    type: string;
    enum: string[];
  };
  method: {
    type: string;
    enum: string[];
  };

  contentType?: {
    type: string;
    enum: string[];
  };
  headers?: {
    type: string;
    properties: any;
    required: any[];
    additionalProperties: boolean;
  };
  body?: any;
  queryParameters?: any;
  required?: string[];
};

type ToolEndpointProperties = {
  properties: ToolEndpoint;
  required: string[];
};

type ToolProperties = {
  type: string;
  properties: ToolEndpoint;
  required: string[];
};

type InputSchema = {
  type: string;
  oneOf: ToolEndpointProperties[];
  required: string[];
  defs: {
    [key: string]: {
      type: string;
      format: string;
    };
  };
};

type BaseTool = {
  name: string;
  description: string;
  input_schema: InputSchema;
  features: string[];
  use_cases: string[];
  benefits: string[];
  implementation: string;
  conclusion: string;
};

const example: BaseTool = {
  name: 'tools/create_purchase_order',
  description:
    'The `tools/create_purchase_order`  function is designed to streamline and automate the process of creating purchase orders within your business operations. This tool leverages advanced technology to ensure accuracy, efficiency, and ease of use, making it an essential component for procurement and supply chain management. The function is built to integrate seamlessly with existing systems and workflows, providing a user-friendly interface for generating purchase orders with minimal manual input.',
  features: [
    'Automation of Purchase Order Creation: Automatically generates purchase orders based on predefined templates and business rules, reducing the need for manual data entry.',
    'Real-Time Data Integration: Pulls real-time data from various sources such as inventory systems, supplier databases, and historical purchase orders to ensure the accuracy of the information.',
    'Error Reduction: Validates input data and cross-references it with existing records to minimize errors and discrepancies in purchase orders.',
    'User-Friendly Interface: Provides an intuitive interface that guides users through the purchase order creation process, making it accessible for employees with varying levels of technical expertise.',
    'Customization Options: Allows customization of purchase order templates to match specific business requirements, including branding, terms, and conditions.',
    'Compliance and Standards: Ensures that all purchase orders comply with relevant industry standards and regulatory requirements.',
    'Notifications and Alerts: Sends real-time notifications and alerts to relevant stakeholders upon the creation of a purchase order, ensuring timely approvals and actions.',
    'Historical Data Access: Provides access to historical purchase order data for auditing, reporting, and analysis purposes.',
  ],
  input_schema: {
    type: 'object',
    oneOf: [
      {
        properties: {
          endpoint: {
            type: 'string',
            enum: ['tools/create_purchase_order'],
          },
          method: {
            type: 'string',
            enum: ['POST'],
          },
          headers: {
            type: 'object',
            properties: {},
            required: [],
            additionalProperties: true,
          },
          body: {
            type: 'object',
            properties: {},
            required: ['supplier', 'items', 'delivery_date'],
            additionalProperties: false,
          },
          required: ['supplier', 'items', 'delivery_date'],
        },
        required: ['endpoint', 'method', 'headers', 'body'],
      },
      {
        properties: {
          endpoint: {
            type: 'string',
            enum: ['tools/create_purchase_order'],
          },
          method: {
            type: 'string',
            enum: ['GET'],
          },
          contentType: {
            type: 'string',
            enum: ['application/json'],
          },
          queryParameters: {
            type: 'object',

            properties: {
              po_number: {
                type: 'string',
                description: 'The purchase order number.',
              },
              supplier: {
                type: 'string',
                description: 'The name of the supplier.',
              },
              delivery_date: {
                $ref: '#/defs/date',
              },
              status: {
                type: 'string',
                enum: ['open', 'closed', 'pending'],
              },
              limit: {
                type: 'integer',
                minimum: 1,
                maximum: 100,
                default: 10,
              },
              offset: {
                type: 'integer',
                minimum: 0,
                default: 0,
              },
              sort: {
                type: 'string',
                enum: ['asc', 'desc'],
                default: 'asc',
              },
              fields: {
                type: 'array',
                items: {
                  type: 'string',
                },
                default: ['po_number', 'supplier', 'delivery_date', 'status'],
              },
              search: {
                type: 'string',
                description: 'Search term to filter purchase orders.',
              },
              start_date: {
                $ref: '#/defs/date',
                description: 'The start date for filtering purchase orders.',
              },
              end_date: {
                $ref: '#/defs/date',
                description: 'The end date for filtering purchase orders.',
              },
              total: {
                type: 'boolean',
                default: false,
              },
              moreThan: {
                type: 'number',
                description:
                  'Filter purchase orders with a total greater than the specified amount.',
              },
              lessThan: {
                type: 'number',
                description:
                  'Filter purchase orders with a total less than the specified amount.',
              },
              currency: {
                type: 'string',
                description: 'The currency used for filtering purchase orders.',
              },
            },
            required: [],
            additionalProperties: true,
          },
        },
        required: ['endpoint', 'body', 'contentType'],
      },
    ],
    required: ['endpoint'],
    defs: {
      date: {
        type: 'string',
        format: 'date',
      },
    },
  },
  use_cases: [
    'Procurement Automation: Automate the creation of purchase orders based on inventory levels and reorder points, ensuring that stock levels are maintained without manual intervention.',
    'Supplier Management: Streamline interactions with suppliers by generating standardized purchase orders that include all necessary details and terms, reducing the risk of miscommunication.',
    'Compliance and Reporting: Ensure that all purchase orders are compliant with company policies and regulatory requirements, and easily generate reports for auditing and analysis.',
    'Operational Efficiency: Improve operational efficiency by reducing the time and effort required to create purchase orders, allowing procurement teams to focus on strategic activities.',
  ],
  benefits: [
    'Increased Accuracy: Automated validation and data integration reduce the risk of errors in purchase orders.',
    'Time Savings: Automation and a user-friendly interface significantly reduce the time required to generate purchase orders.',
    'Improved Compliance: Ensures adherence to regulatory requirements and company policies.',
    'Enhanced Productivity: Frees up procurement teams to focus on higher-value tasks by automating routine processes.',
    'Better Supplier Relationships: Standardized and accurate purchase orders improve communication and reliability with suppliers.',
  ],
  implementation:
    'To implement the `tools/create_purchase_order` function, businesses can integrate it into their existing procurement systems through APIs or other integration methods. The tool can be customized to fit specific business needs and workflows, ensuring a seamless addition to the existing infrastructure. Training and support are available to help users get the most out of the tool and maximize its benefits.',
  conclusion:
    'The `tools/create_purchase_order` function is a powerful tool that enhances the purchase order process by leveraging automation, real-time data integration, and user-friendly interfaces. It is designed to improve accuracy, efficiency, and compliance in procurement activities, making it an invaluable asset for businesses looking to optimize their supply chain management. Whether used for automating routine tasks or ensuring compliance, this tool is a critical component for modern procurement operations.',
};
