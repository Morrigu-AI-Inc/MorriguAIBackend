import { Module } from '@nestjs/common';
import { ResourceSimilarityAnalysisController } from './resource_similarity_analysis.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [ResourceSimilarityAnalysisController],
  imports: [DbModule],
})
export class ResourceSimilarityAnalysisModule {}
