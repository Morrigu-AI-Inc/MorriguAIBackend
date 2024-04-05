import { Test, TestingModule } from '@nestjs/testing';
import { FetchListingController } from './fetch_listing.controller';

describe('FetchListingController', () => {
  let controller: FetchListingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FetchListingController],
    }).compile();

    controller = module.get<FetchListingController>(FetchListingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
