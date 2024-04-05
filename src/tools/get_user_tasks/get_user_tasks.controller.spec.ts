import { Test, TestingModule } from '@nestjs/testing';
import { GetUserTasksController } from './get_user_tasks.controller';

describe('GetUserTasksController', () => {
  let controller: GetUserTasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetUserTasksController],
    }).compile();

    controller = module.get<GetUserTasksController>(GetUserTasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
