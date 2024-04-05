import { Controller, Get, Query } from '@nestjs/common';

@Controller('tools/submit_assessment')
export class SubmitAssessmentController {
  constructor() {}

  @Get()
  async submitAssessment(
    @Query('parameters') parameters: string,
  ): Promise<any> {
    const validPayload = JSON.parse(parameters);

    return {
      result: {
        tool_name: 'submit_assessment',
        stdout: validPayload,
      },
    };
  }
}
