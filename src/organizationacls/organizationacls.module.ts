import { Module } from '@nestjs/common';
import { OrganizationaclsService } from './organizationacls.service';
import { OrganizationaclsController } from './organizationacls.controller';

@Module({
  controllers: [OrganizationaclsController],
  providers: [OrganizationaclsService],
})
export class OrganizationaclsModule {}
