import { Test, TestingModule } from '@nestjs/testing';
import { PandadocGetDocumentSectionsController } from './pandadoc_get_document_sections.controller';

describe('PandadocGetDocumentSectionsController', () => {
  let controller: PandadocGetDocumentSectionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PandadocGetDocumentSectionsController],
    }).compile();

    controller = module.get<PandadocGetDocumentSectionsController>(PandadocGetDocumentSectionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
