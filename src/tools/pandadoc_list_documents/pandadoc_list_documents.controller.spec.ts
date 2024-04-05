import { Test, TestingModule } from '@nestjs/testing';
import { PandadocListDocumentsController } from './pandadoc_list_documents.controller';

describe('PandadocListDocumentsController', () => {
  let controller: PandadocListDocumentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PandadocListDocumentsController],
    }).compile();

    controller = module.get<PandadocListDocumentsController>(PandadocListDocumentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
