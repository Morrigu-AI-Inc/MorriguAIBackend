import { ListingModule } from './../../listing/listing.module';
import { Module } from '@nestjs/common';
import { FetchListingController } from './fetch_listing.controller';

@Module({
  controllers: [FetchListingController],
  imports: [ListingModule],
})
export class FetchListingModule {}
