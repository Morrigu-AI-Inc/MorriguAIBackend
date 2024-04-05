import { Test, TestingModule } from '@nestjs/testing';
import { SubmitSellerContactInformationController } from './submit_seller_contact_information.controller';

describe('SubmitSellerContactInformationController', () => {
  let controller: SubmitSellerContactInformationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubmitSellerContactInformationController],
    }).compile();

    controller = module.get<SubmitSellerContactInformationController>(SubmitSellerContactInformationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
