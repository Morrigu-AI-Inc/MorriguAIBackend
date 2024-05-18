import { Module } from '@nestjs/common';
import { PurchasingService } from './purchasing.service';
import { PurchasingController } from './purchasing.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [PurchasingController],
  providers: [PurchasingService],
  imports: [DbModule],  
})
export class PurchasingModule {}
