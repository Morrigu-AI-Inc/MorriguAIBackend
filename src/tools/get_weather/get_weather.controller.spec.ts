import { Test, TestingModule } from '@nestjs/testing';
import { GetWeatherController } from './get_weather.controller';

describe('GetWeatherController', () => {
  let controller: GetWeatherController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetWeatherController],
    }).compile();

    controller = module.get<GetWeatherController>(GetWeatherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
