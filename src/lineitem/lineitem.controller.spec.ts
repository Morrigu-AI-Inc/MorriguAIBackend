import { Test, TestingModule } from '@nestjs/testing';
import { LineitemController } from './lineitem.controller';
import { LineitemService } from './lineitem.service';

describe('LineitemController', () => {
  let controller: LineitemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LineitemController],
      providers: [LineitemService],
    }).compile();

    controller = module.get<LineitemController>(LineitemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
