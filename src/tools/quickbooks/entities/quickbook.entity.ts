import { BaseTool } from 'src/tools/types';

export const QuickbooksSelectQuery = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Query Operations Schema',
  description: 'Schema for the query operations supported by the API',
  type: 'object',
  properties: {
    select_statement: {
      type: 'string',
      description: 'The select statement used to query the API',
      pattern:
        '^SELECT \\*|count\\(\\*\\) FROM [a-zA-Z0-9_]+( WHERE .*)?( ORDERBY .*)?( STARTPOSITION [0-9]+)?( MAXRESULTS [0-9]+)?$',
    },
    entity: {
      type: 'string',
      enum: ['PurchaseOrder'],
      description:
        'The name of the queried entity. For example: Customer, Vendor, Invoice, etc. Case sensitive.',
    },
    where_clause: {
      type: 'array',
      description:
        'The WHERE clause filters the returned data according to the value of the PropertyName.',
      items: {
        type: 'object',
        properties: {
          property_name: {
            type: 'string',
            description: 'The name of the property to filter by',
          },
          operator: {
            type: 'string',
            enum: ['IN', '=', '<', '>', '<=', '>=', 'LIKE'],
            description: 'The operator used in the WHERE clause',
          },
          value: {
            type: ['string', 'number', 'boolean', 'array'],
            description: 'The value to compare against',
            items: {
              type: ['string', 'number'],
            },
          },
        },
        required: ['property_name', 'operator', 'value'],
      },
    },
    order_by_clause: {
      type: 'array',
      description: 'The ORDER BY clause sorts the result.',
      items: {
        type: 'object',
        properties: {
          property_name: {
            type: 'string',
            description: 'The name of the property to sort by',
          },
          order: {
            type: 'string',
            enum: ['ASC', 'DESC'],
            description: 'The sort order',
          },
        },
        required: ['property_name'],
      },
    },
    start_position: {
      type: 'integer',
      minimum: 1,
      description: 'The starting point of the response for pagination',
    },
    max_results: {
      type: 'integer',
      minimum: 1,
      maximum: 1000,
      description:
        'The maximum number of entities that can be returned in a response',
    },
  },
  required: ['select_statement', 'entity'],
};

export class QuickbookQueryTool extends BaseTool {
  public name = 'tools/quickbooks/query';
  public description = 'Quickbooks Query Tool';
  public input_schema = {
    type: 'object',
    properties: {
      endpoint: {
        type: 'string',
        description: 'API endpoint for the request',
        enum: ['/tools/quickbooks/query'],
      },
      method: {
        type: 'string',
        enum: ['GET'],
        description: 'HTTP method used for the request',
        default: 'GET',
      },
      contentType: {
        type: 'string',
        enum: ['application/json'],
        description: 'Content type of the request body',
        default: 'application/json',
      },
      headers: {
        type: 'object',
        description: 'Headers to send to the tool',
        default: {},
      },
      queryParameters: {
        oneOf: [QuickbooksSelectQuery.properties],
      },
      body: {
        type: 'object',
        description: 'Payload to send to the tool',
        default: {},
      },
    },
    required: [
      'endpoint',
      'method',
      'contentType',
      'queryParameters',
      'headers',
    ],
    additionalProperties: false,
  };

  public toJsonTool() {
    return {
      name: this.name,
      description: this.description,
      input_schema: this.input_schema,
    };
  }
}

export class Quickbook extends BaseTool {
  public name = 'tools/quickbooks';
  public description = 'Quickbooks';
  public input_schema = {
    endpoint: {
      type: 'string',
      description: 'API endpoint for the request',
      enum: ['/tools/quickbooks'],
    },
    method: {
      type: 'string',
      enum: ['GET'],
      description: 'HTTP method used for the request',
    },
    contentType: {
      type: 'string',
      enum: ['application/json'],
      description: 'Content type of the request body',
    },
    body: {
      type: 'object',
      description: 'Payload to send to the tool',
    },
    queryParameters: {
      type: 'object',
      description: 'Query parameters to send to the tool',
    },
    headers: {
      type: 'object',
      description: 'Headers to send to the tool',
    },
  };
}
