import { Injectable } from '@nestjs/common';
import { CreateUseraclDto } from './dto/create-useracl.dto';
import { UpdateUseraclDto } from './dto/update-useracl.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/db/schemas/User';
import { UserACL, UserACLDocument } from 'src/db/schemas/ACL';

@Injectable()
export class UseraclsService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User>,
    @InjectModel('UserACL')
    private readonly useraclModel: Model<UserACLDocument>,
  ) {
    // add an acl to all users that don't have one
    this.userModel.find().then((users) => {
      users.forEach(
        async (user) => {
          if (!user.acl) {
            const acl = new this.useraclModel();
            await acl.save();
            user.acl = acl;

            await user.save();
          }
        },
        (err) => {
          console.error(err);
        },
      );
    });
  }

  create(createUseraclDto: CreateUseraclDto) {
    return 'This action adds a new useracl';
  }

  findAll() {
    return `This action returns all useracls`;
  }

  findOne(id: number) {
    return `This action returns a #${id} useracl`;
  }

  async update(id: string, updateUseraclDto: UpdateUseraclDto) {
    // update a user with a updated acl
    const user = await this.userModel.findOne({ _id: id });

    if (!user) {
      return null;
    }

    console.log('user:', user);

    let acl = await this.useraclModel.findOne(user.acl);

    if (!acl) {
      return null;
    }

    for (const key in updateUseraclDto) {
      const user = await this.userModel.findOne({ _id: updateUseraclDto[key] });
      acl[key] = user;
    }

    await acl.save();

    return true;
  }

  remove(id: number) {
    return `This action removes a #${id} useracl`;
  }
}
