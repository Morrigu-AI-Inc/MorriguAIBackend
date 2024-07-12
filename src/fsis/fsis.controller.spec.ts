import { Test, TestingModule } from '@nestjs/testing';
import { FsisController } from './fsis.controller';
import { FsisService } from './fsis.service';

describe('FsisController', () => {
  let controller: FsisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FsisController],
      providers: [FsisService],
    }).compile();

    controller = module.get<FsisController>(FsisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
