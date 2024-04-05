import { Module } from '@nestjs/common';
import { SubmitAssessmentController } from './submit_assessment.controller';

@Module({
  controllers: [SubmitAssessmentController]
})
export class SubmitAssessmentModule {}
