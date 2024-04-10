import { Test, TestingModule } from '@nestjs/testing';
import { SalesforceMetadataSobjectFetcherController } from './salesforce_metadata_sobject_fetcher.controller';

describe('SalesforceMetadataSobjectFetcherController', () => {
  let controller: SalesforceMetadataSobjectFetcherController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesforceMetadataSobjectFetcherController],
    }).compile();

    controller = module.get<SalesforceMetadataSobjectFetcherController>(SalesforceMetadataSobjectFetcherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
