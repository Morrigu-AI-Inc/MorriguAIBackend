import { Controller, Get, Query, Req } from '@nestjs/common';
import * as yup from 'yup';

// "parameters": [
//     {
//       "name": "idProperty",
//       "type": "string",
//       "description": "The name of a property whose values are unique for this object type, used to identify the specific company to retrieve. This could be the company's ID or another unique identifier set within HubSpot."
//     },
//     {
//       "name": "properties",
//       "type": "array",
//       "default": [],
//       "optional": true,
//       "description": "Defines a list of the properties to be returned in the response. This allows for customizable data retrieval, enabling users to focus on specific details relevant to their analysis."
//     },
//     {
//       "name": "propertiesWithHistory",
//       "type": "array",
//       "default": [],
//       "optional": true,
//       "description": "Requests the return of specified properties along with their history of previous values. This parameter is useful for tracking changes over time but may impact the detail of information retrieved."
//     },
//     {
//       "name": "associations",
//       "type": "array",
//       "default": [],
//       "optional": true,
//       "description": "Specifies a list of object types to retrieve associated IDs for. This parameter is designed to expand the scope of data retrieval by including relevant associated data."
//     },
//     {
//       "name": "archived",
//       "type": "boolean",
//       "default": false,
//       "optional": true,
//       "description": "Determines whether to return only results that have been archived. This parameter allows users to access historical data that may no longer be active but is still relevant for analysis."
//     }
//   ]

@Controller('tools/get_hubspot_company')
export class GetHubspotCompanyController {
  @Get()
  async getHubspotCompany(
    @Req() req,
    @Query('parameters') parameters: string,
  ): Promise<any> {
    try {
      const validPayload = JSON.parse(parameters);

      const validation = yup.object().shape({
        company_id: yup.string().required(),
        idProperty: yup.string(),
        properties: yup.array(),
        propertiesWithHistory: yup.array(),
        associations: yup.array(),
        archived: yup.boolean(),
      });

      const validatedVals = validation.validateSync(validPayload, {
        abortEarly: true,
      });

      const results = await fetch(
        `${process.env.PARAGON_URL}/sdk/proxy/hubspot/crm/v3/objects/companies/${validatedVals.company_id}`,
        {
          method: 'GET',
          headers: {
            Authorization: req.headers.authorization,
            'Content-Type': 'application/json',
          },
        },
      );

      const jsonResults = await results.json();

      return {
        result: {
          tool_name: 'get_hubspot_company',
          stdout: jsonResults,
        },
      };
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return {
          result: {
            tool_name: 'get_hubspot_company',
            stdout: {
              message: 'Error fetching company.',
              data: error.errors,
            },
          },
        };
      }
      return {
        result: {
          tool_name: 'get_hubspot_company',
          stdout: {
            Error: error,
          },
        },
      };
    }
  }
}
