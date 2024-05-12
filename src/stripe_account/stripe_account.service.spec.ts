import { Test, TestingModule } from '@nestjs/testing';
import { StripeAccountService } from './stripe_account.service';

describe('StripeAccountService', () => {
  let service: StripeAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StripeAccountService],
    }).compile();

    service = module.get<StripeAccountService>(StripeAccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
