import { Test, TestingModule } from '@nestjs/testing';
import { StripeAccountController } from './stripe_account.controller';
import { StripeAccountService } from './stripe_account.service';

describe('StripeAccountController', () => {
  let controller: StripeAccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StripeAccountController],
      providers: [StripeAccountService],
    }).compile();

    controller = module.get<StripeAccountController>(StripeAccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
