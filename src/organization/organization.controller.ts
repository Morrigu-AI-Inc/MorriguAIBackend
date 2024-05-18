import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { Organization, OrganizationDocument, User } from 'src/db/schemas';
import {
  AuthorizationGuard,
  UserAuth,
} from 'src/authorization/authorization.guard';

@Controller('organization')
@UseGuards(AuthorizationGuard)
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  async create(
    @Body() createOrganizationDto: Partial<OrganizationDocument>,
    @UserAuth() user: any,
  ): Promise<Organization> {
    console.log('createOrganizationDto', createOrganizationDto, user);
    // Assuming userId is part of the DTO or obtained from the authorization guard
    const userId = 'someUserId'; // replace this with actual user ID extraction logic
    return this.organizationService.createOrganizaton(createOrganizationDto);
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
