import { Test, TestingModule } from '@nestjs/testing';
import { NotepadController } from './notepad.controller';
import { NotepadService } from './notepad.service';

describe('NotepadController', () => {
  let controller: NotepadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotepadController],
      providers: [NotepadService],
    }).compile();

    controller = module.get<NotepadController>(NotepadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
