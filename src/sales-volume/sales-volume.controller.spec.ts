import { Test, TestingModule } from '@nestjs/testing';
import { SalesVolumeController } from './sales-volume.controller';

describe('SalesVolumeController', () => {
  let controller: SalesVolumeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesVolumeController],
    }).compile();

    controller = module.get<SalesVolumeController>(SalesVolumeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
