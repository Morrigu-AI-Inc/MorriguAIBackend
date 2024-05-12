import { Test, TestingModule } from '@nestjs/testing';
import { BbsubsController } from './bbsubs.controller';

describe('BbsubsController', () => {
  let controller: BbsubsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BbsubsController],
    }).compile();

    controller = module.get<BbsubsController>(BbsubsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
