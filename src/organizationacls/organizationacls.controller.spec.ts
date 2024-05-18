import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationaclsController } from './organizationacls.controller';
import { OrganizationaclsService } from './organizationacls.service';

describe('OrganizationaclsController', () => {
  let controller: OrganizationaclsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationaclsController],
      providers: [OrganizationaclsService],
    }).compile();

    controller = module.get<OrganizationaclsController>(OrganizationaclsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
