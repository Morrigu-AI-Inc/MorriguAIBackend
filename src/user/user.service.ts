import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrganizationDocument, UserACL, UserDocument } from 'src/db/schemas';
import { Supplier } from 'src/db/schemas/Supplier';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    @InjectModel('Organization')
    private readonly organizationModel: Model<OrganizationDocument>,
    @InjectModel('Supplier') private readonly supplierModel: Model<Supplier>,
    @InjectModel('UserACL') private readonly useraclModel: Model<UserACL>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const decoded = jwt.decode(createUserDto.id_token) as any;

    // search for user first to avoid duplicates

    const user = await this.userModel.findOne({ id: decoded.sub });

    if (user) {
      return user;
    }

    const acl = new this.useraclModel();
    await acl.save();

    const newUser = await this.userModel.create({
      id: decoded.sub,
      provider: decoded.iss,
      email: decoded.email,
      name: decoded.name,
      data: decoded,
      role: null,
      stripeAccount: null,
      acl: acl,
      config: {},
      employee: null,
    });

    if (!newUser) {
      throw new Error('Failed to create user');
    }
    return newUser;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async me(id: string) {
    try {
      const user = await this.userModel.findOne({ id }).populate('acl').exec();

      if (!user) {
        return {
          user: null,
        };
      }

      // Get all organizations that the user is part of
      const organizations = await this.organizationModel
        .findOne({
          users: { $in: [user._id] },
        })
        .populate('users default_acl assistant json_assistant work_assistant')
        .exec();

      if (!organizations) {
        return {
          user,
        };
      }

      const suppliers = await this.supplierModel.findOne({
        owner: organizations._id,
      });

      if (!suppliers) {
        return {
          user,
          organizations,
        };
      }

      // console.log({
      //   user,
      //   organizations,
      //   suppliers,
      // });

      return {
        user,
        organizations,
        suppliers,
      };
    } catch (error) {
      console.error('Error fetching user and organizations:', error);
      throw new Error('Failed to fetch user and organizations');
    }
  }
}
