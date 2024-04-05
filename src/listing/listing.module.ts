import { Module } from '@nestjs/common';
import { ListingController } from './listing.controller';
import { ListingService } from './listing.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ListingSchema } from 'src/db/schemas/Listing';

@Module({
  controllers: [ListingController],
  providers: [ListingService],
  imports: [
    MongooseModule.forFeature([{ name: 'Listing', schema: ListingSchema }]),
  ],
  exports: [
    MongooseModule.forFeature([{ name: 'Listing', schema: ListingSchema }]),
    ListingService,
  ],
})
export class ListingModule {}
