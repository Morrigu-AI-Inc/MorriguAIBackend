import { Test, TestingModule } from '@nestjs/testing';
import { GetSalesforceObjectsListController } from './get_salesforce_objects_list.controller';

describe('GetSalesforceObjectsListController', () => {
  let controller: GetSalesforceObjectsListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetSalesforceObjectsListController],
    }).compile();

    controller = module.get<GetSalesforceObjectsListController>(GetSalesforceObjectsListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
