import { Module } from '@nestjs/common';
import { CreateListingController } from './create_listing.controller';
import { ListingService } from 'src/listing/listing.service';
import { ListingModule } from 'src/listing/listing.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ListingSchema } from 'src/db/schemas/Listing';

@Module({
  controllers: [CreateListingController],
  providers: [ListingModule, ListingService],
  imports: [
    MongooseModule.forFeature([{ name: 'Listing', schema: ListingSchema }]),
  ],
})
export class CreateListingModule {}
