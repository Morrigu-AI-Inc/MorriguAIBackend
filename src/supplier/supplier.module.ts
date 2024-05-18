import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [SupplierController],
  providers: [SupplierService],
  imports: [DbModule],
})
export class SupplierModule {}
