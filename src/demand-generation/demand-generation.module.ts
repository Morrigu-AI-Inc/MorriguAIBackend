import { Module } from '@nestjs/common';
import { DemandGenerationService } from './demand-generation.service';
import { DbModule } from 'src/db/db.module';
import { DemandGenerationController } from './demand-generation.controller';

@Module({
  providers: [DemandGenerationService],
  imports: [DbModule],
  controllers: [DemandGenerationController],
})
export class DemandGenerationModule {}
