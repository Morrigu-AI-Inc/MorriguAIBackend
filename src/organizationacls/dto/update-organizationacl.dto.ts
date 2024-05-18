import { PartialType } from '@nestjs/mapped-types';
import { CreateOrganizationaclDto } from './create-organizationacl.dto';

export class UpdateOrganizationaclDto extends PartialType(CreateOrganizationaclDto) {}
