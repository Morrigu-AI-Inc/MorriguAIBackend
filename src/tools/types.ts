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

export type ToolEndpoint = {
  endpoint: ToolEndpointProperties;
  method: ToolEndpointProperties;
  contentType?: ToolEndpointProperties;
  headers?: ToolEndpointProperties;
  body?: ToolEndpointProperties;
  queryParameters?: ToolEndpointProperties;
  required?: string[];
};

// type ToolEndpointProperties = {
//   properties: ToolEndpoint;
//   required: string[];
// };

type ToolProperties = {
  type: string;
  properties: ToolEndpoint;
  required: string[];
};

export type ToolEndpointProperties = {
  type?: string;
  properties?: {
    [key: string]: {
      type: string;
      format?: string;
      items?: ToolEndpointProperties; // For nested properties
      oneOf?: ToolEndpointProperties[]; // For oneOf property in nested schemas
      anyOf?: ToolEndpointProperties[]; // For anyOf property
      allOf?: ToolEndpointProperties[]; // For allOf property
      not?: ToolEndpointProperties; // For not property
      required?: string[];
      enum?: any[];
      const?: any; // For const property
      default?: any; // For default property
      minimum?: number; // For numeric properties
      maximum?: number; // For numeric properties
      exclusiveMinimum?: number; // For numeric properties
      exclusiveMaximum?: number; // For numeric properties
      multipleOf?: number; // For numeric properties
      minLength?: number; // For string properties
      maxLength?: number; // For string properties
      pattern?: string; // For string properties
      minItems?: number; // For array properties
      maxItems?: number; // For array properties
      uniqueItems?: boolean; // For array properties
      additionalProperties?: boolean | ToolEndpointProperties; // For object properties
      description?: string; // For documentation purposes
      title?: string; // For documentation purposes
      examples?: any[]; // For providing example values
      dependencies?: { [key: string]: string[] | ToolEndpointProperties }; // For dependencies property
      patternProperties?: { [key: string]: ToolEndpointProperties }; // For patternProperties
      if?: ToolEndpointProperties; // For conditional subschemas
      then?: ToolEndpointProperties; // For conditional subschemas
      else?: ToolEndpointProperties; // For conditional subschemas
    };
  };
  required?: string[];
  additionalProperties?: boolean | ToolEndpointProperties; // For object properties
  minItems?: number; // For array properties
  maxItems?: number; // For array properties
  uniqueItems?: boolean; // For array properties
  items?: ToolEndpointProperties; // For array items
  enum?: any[];
  const?: any;
  default?: any;
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number;
  exclusiveMaximum?: number;
  multipleOf?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  description?: string;
  title?: string;
  examples?: any[];
  oneOf?: ToolEndpointProperties[];
  anyOf?: ToolEndpointProperties[];
  allOf?: ToolEndpointProperties[];
  not?: ToolEndpointProperties;
  dependencies?: { [key: string]: string[] | ToolEndpointProperties }; // For dependencies property
  patternProperties?: { [key: string]: ToolEndpointProperties }; // For patternProperties
  if?: ToolEndpointProperties; // For conditional subschemas
  then?: ToolEndpointProperties; // For conditional subschemas
  else?: ToolEndpointProperties; // For conditional subschemas
  [key: string]: any;
};

export type InputSchema = {
  type: string;
  oneOf: ToolEndpointProperties[];
  required: string[];
  defs: {
    [key: string]: {
      type: string;
      format: string;
      items?: ToolEndpointProperties;
      oneOf?: ToolEndpointProperties[];
      anyOf?: ToolEndpointProperties[];
      allOf?: ToolEndpointProperties[];
      not?: ToolEndpointProperties;
      enum?: any[];
      const?: any;
      default?: any;
      minimum?: number;
      maximum?: number;
      exclusiveMinimum?: number;
      exclusiveMaximum?: number;
      multipleOf?: number;
      minLength?: number;
      maxLength?: number;
      pattern?: string;
      description?: string;
      title?: string;
      examples?: any[];
      additionalProperties?: boolean | ToolEndpointProperties;
      dependencies?: { [key: string]: string[] | ToolEndpointProperties };
      patternProperties?: { [key: string]: ToolEndpointProperties };
      if?: ToolEndpointProperties;
      then?: ToolEndpointProperties;
      else?: ToolEndpointProperties;
    };
  };
};

export abstract class BaseTool {
  name?: string;
  description?: string;
  input_schema?: ToolProperties | ToolEndpoint;
  features?: string[];
  use_cases?: string[];
  benefits?: string[];
  implementation?: string;
  conclusion?: string;
  [key: string]: any;
};