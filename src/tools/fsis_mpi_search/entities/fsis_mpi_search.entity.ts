import { BaseTool } from 'src/tools/types';

export class FsisMpiSearch {}

export class FsisMpiSearchTool extends BaseTool {
  public name = 'tools/fsis_mpi_search';
  public description = `
  AGRITECH AND MANUFACTURING SUPPLY CHAIN SEARCH TOOL
  
  This tool allows users to search the Meat, Poultry, and Egg Product Inspection (MPI) Directory by optional fields: street, city, and state (two-letter code). 
  The MPI Directory is a listing of establishments that produce meat, poultry, and/or egg products regulated by FSIS. 
  The dataset includes additional demographic information about these establishments, such as size, species slaughtered, and aggregate categorical production information. 
  Users can view establishments geographically and filter by location, species slaughtered, and categorical production activities. 
  These data are updated weekly.

  Searchable fields:
  - Street: The street address of the establishment. Example: '1415 Weavertown Road'.
  - City: The city where the establishment is located. Example: 'Lebanon'.
  - State: The two-letter state code where the establishment is located. Example: 'PA'. Must be two uppercase letters.
  - Tags: An array of tags representing the activities and operations of the establishment. Available tags include:
    - Meat Processing
    - Poultry Processing
    - Egg Processing
    - Meat Slaughter
    - Poultry Slaughter
    - Egg Slaughter
    - Slaughterhouse
    - Processing

  This tool facilitates searching for establishments using any combination of these optional fields. 
  The search will return establishments matching the provided criteria.

  ==================OUTPUT_INSTRUCTIONS========================
  When talking to the user about the results, you should output the following information:
  - name (string): The name of the establishment.
  ==================END_OUTPUT_INSTRUCTIONS========================
  `;
  public input_schema = {
    type: 'object',
    properties: {
      endpoint: {
        type: 'string',
        description: 'API endpoint for the request',
        enum: ['/tools/fsis_mpi_search'],
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
        type: 'object',
        properties: {
          street: {
            type: 'string',
            description:
              'The street address of the establishment. Example: "1415 Weavertown Road".',
          },
          city: {
            type: 'string',
            description:
              'The city where the establishment is located. Example: "Lebanon".',
          },
          state: {
            type: 'string',
            description:
              'The two-letter state code where the establishment is located. Example: "PA". Must be two uppercase letters.',
            pattern: '^[A-Z]{2}$',
          },
          limit: {
            type: 'number',
            description: 'The number of results to return per page.',
            default: 10,
          },
          page: {
            type: 'number',
            description: 'The page number to return.',
            default: 1,
          },
        },
        additionalProperties: false,
        required: ['limit', 'page'],
        oneOf: [
          { required: ['street'] },
          { required: ['city'] },
          { required: ['state'] },
        ],
      },
      body: {
        type: 'object',
        description: 'Payload to send to the tool',
        default: {},
        additionalProperties: false,
      },
    },
    required: [
      'endpoint',
      'method',
      'contentType',
      'headers',
      'queryParameters',
    ],
    additionalProperties: false,
  };
}
