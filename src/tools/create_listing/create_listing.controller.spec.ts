import { Test, TestingModule } from '@nestjs/testing';
import { CreateListingController } from './create_listing.controller';

describe('CreateListingController', () => {
  let controller: CreateListingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateListingController],
    }).compile();

    controller = module.get<CreateListingController>(CreateListingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
