import { Controller, Get } from '@nestjs/common';

@Controller('tools/co2_impact')
export class Co2ImpactController {
  @Get()
  async getCo2Impact() {
    // example json object for cos impact from an expense
    return {
      co2Impact: 0.5,
    };
  }
}
