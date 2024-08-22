import { Test, TestingModule } from '@nestjs/testing';
import { ImportyetiController } from './importyeti.controller';
import { ImportyetiService } from './importyeti.service';

describe('ImportyetiController', () => {
  let controller: ImportyetiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImportyetiController],
      providers: [ImportyetiService],
    }).compile();

    controller = module.get<ImportyetiController>(ImportyetiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
