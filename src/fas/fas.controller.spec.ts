import { Test, TestingModule } from '@nestjs/testing';
import { FasController } from './fas.controller';
import { FasService } from './fas.service';

describe('FasController', () => {
  let controller: FasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FasController],
      providers: [FasService],
    }).compile();

    controller = module.get<FasController>(FasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
