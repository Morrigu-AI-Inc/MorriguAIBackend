import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [AddressController],
  providers: [AddressService],
  imports: [DbModule]
})
export class AddressModule {}
