import { Test, TestingModule } from '@nestjs/testing';
import { ResourceSimilarityAnalysisController } from './resource_similarity_analysis.controller';

describe('ResourceSimilarityAnalysisController', () => {
  let controller: ResourceSimilarityAnalysisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResourceSimilarityAnalysisController],
    }).compile();

    controller = module.get<ResourceSimilarityAnalysisController>(ResourceSimilarityAnalysisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
