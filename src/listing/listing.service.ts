import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ListingDocument } from 'src/db/schemas/Listing';

@Injectable()
export class ListingService {
  constructor(
    @InjectModel('Listing')
    private readonly listingModel: Model<ListingDocument>,
  ) {}

  async getAllListings(): Promise<ListingDocument[]> {
    return this.listingModel.find();
  }

  async getListingById(id: string): Promise<ListingDocument> {
    return this.listingModel.findOne({ _id: id });
  }

  async createListing(
    listingData: Partial<ListingDocument>,
  ): Promise<ListingDocument> {
    return this.listingModel.create(listingData);
  }

  async updateListing(
    id: string,
    listingData: Partial<ListingDocument>,
  ): Promise<ListingDocument> {
    return this.listingModel.findOneAndUpdate(
      {
        _id: id,
      },
      listingData,
      {
        new: true,
      },
    );
  }

  async deleteListing(id: string): Promise<any> {
    return this.listingModel.deleteOne({
      _id: id,
    });
  }
}
