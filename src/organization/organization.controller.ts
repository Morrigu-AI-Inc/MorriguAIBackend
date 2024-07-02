import { Body, Controller, Post } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import {
  BillingDocument,
  BillingPlanDocument,
  Organization,
  OrganizationACLDocument,
  OrganizationDocument,
  UserDocument,
} from 'src/db/schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TierDocument } from 'src/db/schemas/Tier';
import { AssistantService } from 'src/assistant/assistant.service';
import assistants_json from 'src/assistant/assistants_json';
import { SupplierDocument } from 'src/db/schemas/Supplier';

@Controller('organization')
// @UseGuards(AuthorizationGuard)
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly assistantService: AssistantService,
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    @InjectModel('OrganizationACL')
    private readonly organizationACLModel: Model<OrganizationACLDocument>,
    @InjectModel('BillingPlan')
    private readonly billingPlanModel: Model<BillingPlanDocument>,
    @InjectModel('Tier')
    private readonly tierModel: Model<TierDocument>,
    @InjectModel('Billing')
    private readonly billingModel: Model<BillingDocument>,
    @InjectModel('Supplier')
    private readonly supplierModel: Model<SupplierDocument>,
  ) {}

  @Post()
  async create(
    @Body() createOrganizationDto: Partial<any>,
    // @UserAuth() user: any,
  ): Promise<OrganizationDocument> {
    // Assuming userId is part of the DTO or obtained from the authorization guard

    // find user by id
    const user = await this.userModel.findOne({
      id: createOrganizationDto.owner,
    });

    if (!user) {
      throw new Error('User not found');
    }

    // create default ACL for the organization
    const acl = await this.organizationACLModel.create({
      permissions: [],
    });

    createOrganizationDto.owner = user._id;
    createOrganizationDto.default_acl = acl._id;

    // create a new billing plan
    const billingPlan = await this.billingPlanModel.create({
      name: 'Free',
      description: 'Free Plan',
      price_per_seat: 0,
      seats: 1,

      terminates_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // create a new tier
    const tier = await this.tierModel.create({
      name: 'Free',
      description: 'Free Tier',
      billing_plan: billingPlan._id,
    });

    // create a new billing
    const plan = await this.billingModel.create({
      plan: billingPlan._id,
      tier: tier._id,
    });

    createOrganizationDto.billing = plan._id;

    const org = await this.organizationService.createOrganizaton({
      ...createOrganizationDto,
      users: [user._id],
    });

    if (!org) {
      throw new Error('Failed to create organization');
    }

    const supplier = await this.supplierModel.create({
      name: createOrganizationDto.supplier.name,
      description: createOrganizationDto.supplier.description,
      contactInfo_phone: createOrganizationDto.supplier.contact_phone,
      contactInfo_email: createOrganizationDto.supplier.contact_email,
      address1: createOrganizationDto.supplier.address1,
      address2: createOrganizationDto.supplier.address2,
      city: createOrganizationDto.supplier.city,
      state: createOrganizationDto.supplier.state,
      zip: createOrganizationDto.supplier.zip,
      country: createOrganizationDto.supplier.country,
      latitude: 0,
      longitude: 0,
      owner: org._id,
    });

    if (!supplier) {
      throw new Error('Failed to create supplier');
    }

    const newVS = await this.assistantService.createVectorDatabase(
      org.name + ' - ' + org._id,
      org._id,
    );

    if (!newVS) {
      throw new Error('Failed to create vector database');
    }

    const assistant = await this.assistantService.createAssistant(
      org._id,
      newVS.id,
      'auto',
      {
        name: assistants_json.tools.name + ' - ' + org.name + ' - ' + org._id,
        description: assistants_json.tools.description,
        tools: assistants_json.tools.tools as any,
      },
    );

    const json_assistant = await this.assistantService.createAssistant(
      org._id,
      newVS.id,
      {
        type: 'json_object',
      },
      {
        name: 'JSON Assistant - ' + org.name + ' - ' + org._id,
        description: 'Assistant for JSON',
        tools: assistants_json.defaultJSON.tools as any,
      },
    );

    const worker_assistant = await this.assistantService.createAssistant(
      org._id,
      newVS.id,
      'auto',
      {
        name: 'Worker Assistant - ' + org.name + ' - ' + org._id,
        description: 'Assistant for workers',
        tools: assistants_json.defaultWorker.tools as any,
      },
    );

    if (!assistant) {
      throw new Error('Failed to create assistant');
    }

    const newORg = await this.organizationService.updateOrganization(org._id, {
      assistant: assistant,
      json_assistant: json_assistant,
      work_assistant: worker_assistant,
    });

    return newORg;
  }

  // @Get()
  // async findAll(): Promise<Organization[]> {
  //   return this.organizationService.getAllOrganizations();
  // }

  // @Get(':id')
  // async findOne(@Param('id') id: string): Promise<Organization> {
  //   return this.organizationService.getOrganizationById(id);
  // }

  // @Patch(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateOrganizationDto: Partial<OrganizationDocument>,
  // ): Promise<Organization> {
  //   return this.organizationService.updateOrganization(
  //     id,
  //     updateOrganizationDto,
  //   );
  // }

  // @Delete(':id')
  // async remove(@Param('id') id: string): Promise<void> {
  //   return this.organizationService.deleteOrganization(id);
  // }
}
