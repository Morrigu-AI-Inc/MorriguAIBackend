import { Controller, Get, Logger, Query } from '@nestjs/common';
import { ListingValidationAI } from 'src/db/schemas/Listing';
import { ListingService } from 'src/listing/listing.service';

@Controller('tools/create_listing')
export class CreateListingController {
  private readonly Logger: Logger = new Logger(CreateListingController.name);
  constructor(private readonly listingService: ListingService) {}

  @Get()
  async createListing(@Query('parameters') parameters: string): Promise<any> {
    this.Logger.log('createListing');
    try {
      const jsonObj = JSON.parse(parameters);

      const tempUser = {
        id: 'github|131699377',
        provider: 'auth0',
        name: 'Jason St. Cyr',
        data: {
          type: 'oauth',
          name: 'Jason St. Cyr',
          picture: 'https://avatars.githubusercontent.com/u/131699377?v=4',
          providerAccountId: 'github|131699377',
          provider: 'auth0',
          scope: 'openid profile email',
          nickname: 'jasonstcyrx',
          updatedAt: '2024-03-16T01:23:56.806Z',
          image: 'https://avatars.githubusercontent.com/u/131699377?v=4',
          user_id: 'github|131699377',
        },
      };

      let validations = ListingValidationAI.validateSync(
        { ...jsonObj, agent: tempUser, contact: tempUser },
        {
          abortEarly: false,
        },
      );

      const newListing = await this.listingService.createListing({
        ...jsonObj,
        agent: tempUser,
        contact: tempUser,
      });

      return {
        result: {
          tool_name: 'create_listing',
          stdout: {
            message: 'Listing created successfully.',
            data: newListing,
          },
        },
      };
    } catch (error) {
      this.Logger.error('Error creating listing', error.errors);
      if (error.name === 'ValidationError') {
        return {
          result: {
            tool_name: 'create_listing',
            stdout: {
              message: 'Error creating listing.',
              error: error.errors,
            },
          },
        };
      }
      return {
        result: {
          tool_name: 'create_listing',
          stdout: {
            message: 'Error creating listing.',
            error: error.message,
          },
        },
      };
    }
  }
}
