import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VendorDocument } from 'src/db/schemas/Vendor';

@Injectable()
export class VendorService {
  constructor(
    @InjectModel('Vendor')
    private readonly vendorModel: Model<VendorDocument>,
  ) {}

  async createVendor(vendor: Partial<VendorDocument>) {
    return await this.vendorModel.create(vendor);
  }

  async getVendors() {
    return await this.vendorModel.find();
  }

  async getVendorById(id: string) {
    return await this.vendorModel.findById(id);
  }

  async updateVendor(id: string, vendor: Partial<VendorDocument>) {
    return await this.vendorModel.findByIdAndUpdate(id, vendor, { new: true });
  }

  async deleteVendor(id: string) {
    return await this.vendorModel.findByIdAndDelete(id);
  }
}
