import { Controller, Get, Query } from '@nestjs/common';
import { ListingService } from 'src/listing/listing.service';
import * as yup from 'yup';

@Controller('tools/fetch_listing')
export class FetchListingController {
  constructor(private readonly listingService: ListingService) {}

  @Get()
  async fetchListing(@Query('parameters') parameters: string): Promise<any> {
    try {
      const jsonObj = JSON.parse(parameters);

      const fetchValidation = yup.object().shape({
        listing_id: yup.string().required(),
      });

      fetchValidation.validateSync(jsonObj, {
        abortEarly: true,
      });

      const listing = await this.listingService.getListingById(
        jsonObj.listing_id,
      );
      // Logic to fetch listing
      return {
        result: {
          tool_name: 'fetch_listing',
          stdout: {
            message: 'Listing fetched successfully.',
            data: {
              listing: listing,
            },
          },
        },
      };
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return {
          result: {
            tool_name: 'fetch_listing',
            stdout: {
              message: 'Error fetching listing.',
              data: error.errors,
            },
          },
        };
      }
      return {
        result: {
          tool_name: 'fetch_listing',
          stdout: {
            message: 'Error fetching listing.',
            data: error,
          },
        },
      };
    }
  }
}
