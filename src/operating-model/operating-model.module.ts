import { Module } from '@nestjs/common';
import { OperatingModelService } from './operating-model.service';
import { DbModule } from 'src/db/db.module';
import { OperatingModelController } from './operating-model.controller';

@Module({
  providers: [OperatingModelService],
  imports: [DbModule],
  controllers: [OperatingModelController],
})
export class OperatingModelModule {}
