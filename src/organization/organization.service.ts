import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Organization,
  OrganizationDocument,
} from 'src/db/schemas/Organization';
import { UserDocument } from 'src/db/schemas/User';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel('Organization') // 👈 'Organization' is the name of the model in 'OrganizationSchema
    private readonly organizationModel: Model<OrganizationDocument>,
    @InjectModel('User') // 👈 'User' is the name of the model in 'UserSchema
    private readonly userModel: Model<UserDocument>,
  ) {}

  async getOrganizationByUserId(userId: string): Promise<OrganizationDocument> {
    const user = await this.userModel.findOne({ id: userId });

    if (!user) {
      return null;
    }

    const org = await this.organizationModel.findOne({
      users: {
        $in: [user._id],
      },
    });

    if (!org) {
      return null;
    }

    return org;
  }

  async createOrganizaton(
    data: Partial<OrganizationDocument>,
  ): Promise<OrganizationDocument> {
    return this.organizationModel.create(data);
  }

  async updateOrganization(
    orgId: string,
    data: Partial<Organization>,
  ): Promise<OrganizationDocument> {
    return this.organizationModel.findByIdAndUpdate(orgId, data, { new: true });
  }
}
