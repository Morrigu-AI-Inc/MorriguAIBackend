import { Module } from '@nestjs/common';
import { FasService } from './fas.service';
import { FasController } from './fas.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [FasController],
  providers: [FasService],
  imports: [DbModule]
})
export class FasModule {}
