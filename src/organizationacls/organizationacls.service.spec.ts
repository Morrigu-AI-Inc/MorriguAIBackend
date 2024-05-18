import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationaclsService } from './organizationacls.service';

describe('OrganizationaclsService', () => {
  let service: OrganizationaclsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganizationaclsService],
    }).compile();

    service = module.get<OrganizationaclsService>(OrganizationaclsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
