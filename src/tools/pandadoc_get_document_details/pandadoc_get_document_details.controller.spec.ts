import { Test, TestingModule } from '@nestjs/testing';
import { PandadocGetDocumentDetailsController } from './pandadoc_get_document_details.controller';

describe('PandadocGetDocumentDetailsController', () => {
  let controller: PandadocGetDocumentDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PandadocGetDocumentDetailsController],
    }).compile();

    controller = module.get<PandadocGetDocumentDetailsController>(PandadocGetDocumentDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
