import { Test, TestingModule } from '@nestjs/testing';
import { PandadocGetDocumentStatusController } from './pandadoc_get_document_status.controller';

describe('PandadocGetDocumentStatusController', () => {
  let controller: PandadocGetDocumentStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PandadocGetDocumentStatusController],
    }).compile();

    controller = module.get<PandadocGetDocumentStatusController>(PandadocGetDocumentStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
