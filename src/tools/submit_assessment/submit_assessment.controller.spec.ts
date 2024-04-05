import { Test, TestingModule } from '@nestjs/testing';
import { SubmitAssessmentController } from './submit_assessment.controller';

describe('SubmitAssessmentController', () => {
  let controller: SubmitAssessmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubmitAssessmentController],
    }).compile();

    controller = module.get<SubmitAssessmentController>(SubmitAssessmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
