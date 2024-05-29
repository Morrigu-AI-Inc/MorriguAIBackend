import { Test, TestingModule } from '@nestjs/testing';
import { GenerativeController } from './generative.controller';
import { GenerativeService } from './generative.service';

describe('GenerativeController', () => {
  let controller: GenerativeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenerativeController],
      providers: [GenerativeService],
    }).compile();

    controller = module.get<GenerativeController>(GenerativeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
