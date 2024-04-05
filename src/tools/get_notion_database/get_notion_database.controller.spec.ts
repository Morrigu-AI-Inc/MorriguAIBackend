import { Test, TestingModule } from '@nestjs/testing';
import { GetNotionDatabaseController } from './get_notion_database.controller';

describe('GetNotionDatabaseController', () => {
  let controller: GetNotionDatabaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetNotionDatabaseController],
    }).compile();

    controller = module.get<GetNotionDatabaseController>(GetNotionDatabaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
