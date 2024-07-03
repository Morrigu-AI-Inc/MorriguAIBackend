import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Request,
} from '@nestjs/common';
import { ListingDocument, ListingValidation } from 'src/db/schemas/Listing';
import { ListingService } from './listing.service';

@Controller('listing')
export class ListingController {
  constructor(private readonly listingService: ListingService) {}
  @Get()
  getAllListings(@Request() req): Promise<ListingDocument[]> {
    console.log('req.user', req.headers);
    try {
      return this.listingService.getAllListings();
    } catch (error) {
      return error;
    }
  }

  @Get(':id')
  getListingById(@Param('id') id: string): Promise<ListingDocument> {
    try {
      return this.listingService.getListingById(id);
    } catch (error) {
      return error;
    }
  }

  @Post()
  createListing(
    @Body() listingData: Partial<ListingDocument>,
  ): Promise<ListingDocument> {
    try {
      ListingValidation.validateSync(listingData, {
        abortEarly: false,
      });
      return this.listingService.createListing(listingData);
    } catch (error) {
      if (error.name === 'ValidationError') {
        return error.errors;
      }

      return error;
    }
  }

  @Put(':id')
  updateListing(
    @Param('id') id: string,
    @Body() listingData: Partial<ListingDocument>,
  ): Promise<ListingDocument> {
    try {
      ListingValidation.validateSync(listingData, {
        abortEarly: true,
      });
      return this.listingService.updateListing(id, listingData);
    } catch (error) {
      return error;
    }
  }

  @Delete(':id')
  deleteListing(@Param('id') id: string): Promise<any> {
    try {
      return this.listingService.deleteListing(id);
    } catch (error) {
      return error;
    }
  }
}
