import { Module } from '@nestjs/common';
import { VectorStoreService } from './vector-store.service';
import { VectorStoreController } from './vector-store.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [VectorStoreController],
  providers: [VectorStoreService],
  imports: [DbModule],
})
export class VectorStoreModule {}
