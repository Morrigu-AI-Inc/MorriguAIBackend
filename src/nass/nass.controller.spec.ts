import { Test, TestingModule } from '@nestjs/testing';
import { NassController } from './nass.controller';
import { NassService } from './nass.service';

describe('NassController', () => {
  let controller: NassController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NassController],
      providers: [NassService],
    }).compile();

    controller = module.get<NassController>(NassController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
