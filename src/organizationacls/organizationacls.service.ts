import { Injectable } from '@nestjs/common';
import { CreateOrganizationaclDto } from './dto/create-organizationacl.dto';
import { UpdateOrganizationaclDto } from './dto/update-organizationacl.dto';

@Injectable()
export class OrganizationaclsService {
  create(createOrganizationaclDto: CreateOrganizationaclDto) {
    return {
      message: 'Organizationacl created successfully',
      data: createOrganizationaclDto,
    };
  }

  findAll() {
    return [];
  }

  findOne(id: number) {
    return {
      _id: id,
      name: 'John Doe',
      email: 'test',
    };
  }

  update(id: number, updateOrganizationaclDto: UpdateOrganizationaclDto) {
    return {
      message: 'Organizationacl updated successfully',
      data: updateOrganizationaclDto,
    };
  }

  remove(id: number) {
    return {
      message: 'Organizationacl deleted successfully',
      data: id,
    };
  }
}
