import { Injectable } from '@nestjs/common';
import { CreateUseraclDto } from './dto/create-useracl.dto';
import { UpdateUseraclDto } from './dto/update-useracl.dto';

@Injectable()
export class UseraclsService {
  create(createUseraclDto: CreateUseraclDto) {
    return 'This action adds a new useracl';
  }

  findAll() {
    return `This action returns all useracls`;
  }

  findOne(id: number) {
    return `This action returns a #${id} useracl`;
  }

  update(id: number, updateUseraclDto: UpdateUseraclDto) {
    return `This action updates a #${id} useracl`;
  }

  remove(id: number) {
    return `This action removes a #${id} useracl`;
  }
}
