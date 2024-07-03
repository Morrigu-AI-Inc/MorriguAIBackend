import { Controller, Get, Logger, Query } from '@nestjs/common';
import { ActionsService } from 'src/actions/actions.service';
import * as yup from 'yup';

@Controller('tools/search_property')
export class SearchPropertyController {
  private readonly logger: Logger = new Logger(SearchPropertyController.name);
  constructor(private readonly actionsService: ActionsService) {}

  @Get()
  async searchProperty(@Query('parameters') parameters: string): Promise<any> {
    try {
      const jsonObj = JSON.parse(parameters);
      const validator = yup.object().shape({
        street_address: yup.string().required(),
        city: yup.string().required(),
        state: yup.string().required(),
        zip_code: yup.string().required(),
      });

      validator.validateSync(jsonObj, {
        abortEarly: true,
      });

      this.logger.log('searchProperty', jsonObj);

      const results = await this.actionsService.getLinksFromGoogle(
        `${jsonObj.street_address} ${jsonObj.city} ${jsonObj.state} ${jsonObj.zip_code} property for sale or listing`,
      );

      const filteredToRedfin = results.filter((result) => {
        return result.includes('realtor' || 'redfin' || 'zillow' || 'trulia');
      });

      console.log(results);

      const data =
        await this.actionsService.fetchTopFiveLinksText(filteredToRedfin);

      console.log('data', data);

      return {
        result: {
          tool_name: 'search_property',
          stdout: {
            SearchResults: data.map((result) => {
              return {
                SearchResult: result,
              };
            }),
          },
        },
      };
    } catch (error) {
      console.error(error);
      return {
        result: {
          tool_name: 'search_property',
          stdout: {
            Error: error,
          },
        },
      };
    }
  }
}
