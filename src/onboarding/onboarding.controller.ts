import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { CreateOnboardingDto } from './dto/create-onboarding.dto';
import { UpdateOnboardingDto } from './dto/update-onboarding.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/db/schemas/User';
import { Organization } from 'src/db/schemas/Organization';
import { StripeAccount } from 'src/db/schemas/StripeAccount';
import { StripeService } from 'src/stripe/stripe.service';
import stripe from 'stripe';
import { OrganizationACL, UserACL } from 'src/db/schemas/ACL';
import { Role } from 'src/db/schemas/Role';

@Controller('onboarding')
export class OnboardingController {
  constructor(
    private readonly onboardingService: OnboardingService,
    private readonly stripeService: StripeService,
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel('Organization')
    private readonly organizationModel: Model<Organization>,
    @InjectModel('StripeAccount')
    private readonly stripeAccountModel: Model<StripeAccount>,
    @InjectModel('UserACL')
    private readonly userAclMode: Model<UserACL>,
    @InjectModel('OrganizationACL')
    private readonly orgAclModel: Model<OrganizationACL>,
    @InjectModel('Role')
    private readonly roleModel: Model<Role>,
  ) {}

  // This is the endpoint that will be used to create various onboarding processes

  @Post()
  async initNewUser(@Body() createOnboardingDto: CreateOnboardingDto) {
    // During The onboarding process we need to create a few things be thorough
    const client = new stripe(process.env.STRIPE_SECRET_KEY);

    const result = await client.customers.create({
      email: createOnboardingDto.user.email,
    });

    // 1. Create a new stripe account for the user
    const newStripeAccount = new this.stripeAccountModel({
      stripeCustomerId: result.id,
    });
    await newStripeAccount.save();

    // 2. Create a new user from the Auth0 data

    // Creat the acl for the user
    const acl = await this.userAclMode.create({
      permissions: ['read', 'write'],
    });

    const foundUser = await this.userModel.findOne({
      email: createOnboardingDto.user.email,
    });

    const roles = ['employee', 'manager', 'accountant', 'admin', 'owner'];

    const newRoles = [];
    let lastRole;
    for (const role of roles) {
      const roleAcl = await this.userAclMode.create({
        permissions: ['read', 'write'],
      });

      const newRole = await this.roleModel.create({
        name: role,
        acl: roleAcl._id,
        type: 'user',
        typeAcls: 'useracls',
      });

      newRoles.push(newRole);

      lastRole = newRole;
    }

    const newUser = foundUser
      ? foundUser
      : await this.userModel.create({
          ...createOnboardingDto.user,
          stripeAccount: newStripeAccount._id,
          acl: acl._id,
          role: newRoles[-1], // owner role
          config: {
            onboarded: true,
          },
        });

    if (foundUser) {
      // This is an existing user, update their stripe account and acl
      // We will use this in the future to update different features and configs
      if (!foundUser.stripeAccount) {
        foundUser.stripeAccount = newStripeAccount;
      }

      if (!foundUser.acl) {
        foundUser.acl = acl;
      }

      if (!foundUser.role) {
        foundUser.role = lastRole;
      }

      foundUser.config = {
        onboarded: true,
      };

      await foundUser.save();
    }

    // 3. Create a simple Organization for the user or add them to an existing one

    if (createOnboardingDto.organizationId) {
      const organization = await this.organizationModel.findById(
        createOnboardingDto.organizationId,
      );

      const org = await this.organizationModel.findByIdAndUpdate(
        createOnboardingDto.organizationId,
        {
          $push: { users: newUser._id },
          roles: newRoles.map((role) => role),
        },
        { new: true },
      );

      await organization.save();
    } else {
      const orgAcl = await this.orgAclModel.create({
        permissions: ['read', 'write'],
      });

      // create roles for the organization ['employee', 'manager', 'accountant', 'admin', 'owner']

      const foundOrgs = await this.organizationModel.find({
        users: {
          $in: [newUser._id],
        },
      });

      // dont create a new organization if the user is already in one
      if (foundOrgs.length === 0) {
        const organization = new this.organizationModel({
          name: createOnboardingDto.user.name,
          users: [newUser._id],
          default_acl: orgAcl._id,
          roles: newRoles.map((role) => role),
          config: {
            onboarded: true,
          },
        });
        await organization.save();
      } else {
        // add the user to the organization
        const organization = foundOrgs[0];
        console.log(
          'roles',
          newRoles.map((role) => role._id),
        );
        const org = await this.organizationModel.findByIdAndUpdate(
          organization._id,
          {
            roles: newRoles.map((role) => role._id),
            config: {
              onboarded: true,
            },
          },
          { new: true },
        );
      }
    }

    // get the user again and populate the stripe account, acl and organization, then return it
    const final = await this.userModel
      .findById(newUser._id)
      .populate('stripeAccount')
      .populate('acl')
      .exec();

    return final;
  }

  @Post()
  create(@Body() createOnboardingDto: CreateOnboardingDto) {
    return this.initNewUser(createOnboardingDto);
  }

  @Get()
  findAll() {
    return this.onboardingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.onboardingService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOnboardingDto: UpdateOnboardingDto,
  ) {
    return this.onboardingService.update(+id, updateOnboardingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.onboardingService.remove(+id);
  }
}
