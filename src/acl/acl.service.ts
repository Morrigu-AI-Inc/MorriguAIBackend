import { Injectable } from '@nestjs/common';
import { CreateAclDto } from './dto/create-acl.dto';
import { UpdateAclDto } from './dto/update-acl.dto';

@Injectable()
export class AclService {
  create(createAclDto: CreateAclDto) {
    return {
      message: 'Acl created successfully',
      data: createAclDto,
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

  update(id: number, updateAclDto: UpdateAclDto) {
    return {
      message: 'Acl updated successfully',
      data: updateAclDto,
    };
  }

  remove(id: number) {
    return {
      message: 'Acl deleted successfully',
      data: id,
    };
  }
}
