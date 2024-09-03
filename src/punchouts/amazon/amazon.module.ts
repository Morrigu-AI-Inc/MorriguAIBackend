import { Module } from '@nestjs/common';
import { AmazonService } from './amazon.service';
import { AmazonController } from './amazon.controller';
import { DbModule } from 'src/db/db.module';
import { EncryptionService } from 'src/encryption/encryption.service';
import { PurchasingService } from 'src/purchasing/purchasing.service';

@Module({
  controllers: [AmazonController],
  providers: [AmazonService, EncryptionService, PurchasingService],
  imports: [DbModule],
})
export class AmazonModule {}
