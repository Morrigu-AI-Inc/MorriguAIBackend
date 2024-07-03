import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorDocument } from 'src/db/schemas/Vendor';

@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  // Add controller methods here
  @Get()
  async getVendors() {
    try {
      const vendors = await this.vendorService.getVendors();
      return { vendors };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get(':id')
  async getVendorById(id: string) {
    try {
      const vendor = await this.vendorService.getVendorById(id);
      return vendor;
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('')
  async createVendor(@Body() vendor: Partial<VendorDocument>) {
    try {
      console.log(vendor);
      const newVendor = await this.vendorService.createVendor(vendor);
      return { newVendor };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Put(':id')
  async updateVendor(
    @Body() vendor: Partial<VendorDocument>,
    @Body() id: string,
  ) {
    try {
      const updatedVendor = await this.vendorService.updateVendor(id, vendor);
      return { updatedVendor };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Delete(':id')
  async deleteVendor(@Body() id: string) {
    try {
      const deletedVendor = await this.vendorService.deleteVendor(id);
      return { deletedVendor };
    } catch (error) {
      return { error: error.message };
    }
  }
}
