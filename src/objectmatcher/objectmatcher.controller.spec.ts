import { Test, TestingModule } from '@nestjs/testing';
import { ObjectmatcherController } from './objectmatcher.controller';
import { ObjectmatcherService } from './objectmatcher.service';

describe('ObjectmatcherController', () => {
  let controller: ObjectmatcherController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ObjectmatcherController],
      providers: [ObjectmatcherService],
    }).compile();

    controller = module.get<ObjectmatcherController>(ObjectmatcherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
