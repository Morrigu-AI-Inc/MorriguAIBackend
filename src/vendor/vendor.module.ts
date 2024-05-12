import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { DbModule } from 'src/db/db.module';
import { VendorController } from './vendor.controller';

@Module({
  providers: [VendorService],
  imports: [DbModule],
  controllers: [VendorController],
})
export class VendorModule {}
