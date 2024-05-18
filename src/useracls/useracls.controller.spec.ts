import { Test, TestingModule } from '@nestjs/testing';
import { UseraclsController } from './useracls.controller';
import { UseraclsService } from './useracls.service';

describe('UseraclsController', () => {
  let controller: UseraclsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UseraclsController],
      providers: [UseraclsService],
    }).compile();

    controller = module.get<UseraclsController>(UseraclsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
