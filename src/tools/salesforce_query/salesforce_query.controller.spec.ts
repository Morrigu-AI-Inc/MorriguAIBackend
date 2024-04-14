import { Test, TestingModule } from '@nestjs/testing';
import { SalesforceQueryController } from './salesforce_query.controller';

describe('SalesforceQueryController', () => {
  let controller: SalesforceQueryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesforceQueryController],
    }).compile();

    controller = module.get<SalesforceQueryController>(SalesforceQueryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
