import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { UserDocument, OrganizationDocument, Team } from 'src/db/schemas';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamService.create(createTeamDto);
  }

  @Get('org/:orgId')
  findAll(@Param('orgId') orgId: string) {
    console.log('orgId', orgId);

    if (!orgId) {
      throw new Error('Organization not found');
    }

    return this.teamService.findAll(orgId);
  }

  // async inviteUserToOrg(orgId: string, email: string) {
  //   const org = await this.organizationModel.findOne({
  //     _id: orgId,
  //   });

  //   if (!org) {
  //     throw new Error('Organization not found');
  //   }

  //   const invitation = await this.invitationModel.create({
  //     email,
  //     organization: org._id,
  //     invitedBy: org.owner,
  //     status: 'pending',
  //     invitationCode: '1234',
  //   });

  //   if (!invitation) {
  //     throw new Error('Failed to create invitation');
  //   }

  //   // send email to user
  //   const sent = this.mailService.sendMail({
  //     from: {
  //       name: 'Procurement App',
  //       address: 'jason@morrigu.ai',
  //     },
  //     to: [email],
  //     subject: 'You have been invited to join an organization',
  //     text: 'You have been invited to join an organization',
  //     category: 'invite',
  //     sandbox: true,
  //   });

  //   if (!sent) {
  //     throw new Error('Failed to send email');
  //   }

  //   // create a invite to the org system that the user can accept

  //   return {
  //     message: 'User invited to org',
  //     email,
  //   };
  // }
  @Post('invite')
  inviteUserToTeam(@Body('orgId') orgId: string, @Body('email') email: string) {
    return this.teamService.inviteUserToOrg(orgId, email);
  }

  // Get the invite by the id
  @Get('invitation/:invitationId')
  async getInvitationById(@Param('invitationId') invitationId: string) {
    return this.teamService.getInvitationById(invitationId);
  }

  // get all the invitations for the user
  @Get('invitations/:orgId')
  async getInvitations(@Param('orgId') orgId: string) {
    console.log('orgId', orgId);
    return this.teamService.getInvitations(orgId);
  }

  // Accept the invitation
  @Post('invitation/:invitationId')
  async acceptInvitation(
    @Param('invitationId') invitationId: string,
    @Body() body: any,
  ) {
    console.log('invitationId', invitationId);
    console.log('body', body);
    return this.teamService.acceptInvitation(invitationId, body);
  }

  @Get('users/:orgId')
  async getUsersByTeamId(@Param('orgId') orgId: string) {
    return this.teamService.getUsersOfOrg(orgId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamService.update(id, updateTeamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamService.remove(id);
  }

  /// Groups

  @Put('groups/:groupId')
  async createGroup(@Param('groupId') groupId: string, @Body() body: any) {
    console.log('groupId', groupId);
    console.log('body', body);
    return this.teamService.updateGroup(groupId, body);
  }

  @Get(':teamId/approvalGroups')
  getApprovalGroups(@Param('teamId') teamId: string) {
    return this.teamService.getApprovalGroups(teamId);
  }

  @Get(':teamId/users')
  getUsersOnTeam(@Param('teamId') teamId: string) {
    return this.teamService.getUsersOnTeam(teamId);
  }

  @Post(':teamId/users')
  addUserToTeam(@Param('teamId') teamId: string, @Body() users: any) {
    console.log('users', users);
    return this.teamService.addUserToTeam(teamId, users);
  }

  @Post(':teamId/teams')
  addTeamToTeam(@Param('teamId') teamId: string, @Body() team: any) {
    return this.teamService.addTeamToTeam(teamId, team);
  }

  @Delete(':teamId/users/:userId')
  removeUserFromTeam(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
  ) {
    console.log('teamId', teamId);
    console.log('userId', userId);
    return this.teamService.removeUserFromTeam(teamId, userId);
  }

  @Get(':teamId/groups')
  getGroupsOnTeam(@Param('teamId') teamId: string) {
    return this.teamService.getGroupsOnTeam(teamId);
  }

  @Post(':teamId/groups')
  addGroupToTeam(@Param('teamId') teamId: string, @Body() group: any) {
    return this.teamService.addGroupToTeam(teamId, group);
  }

  @Post(':teamId/groups/:groupId/users/:userId')
  addUserToGroupOnTeam(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
    @Param('teamId') teamId: string,
  ) {
    return this.teamService.addUserToGroupOnTeam(groupId, userId, teamId);
  }

  @Post('finance/:teamId/users/:userId')
  addFinanceUserToTeam(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
  ) {
    return this.teamService.addFinanceUserToTeam(userId, teamId);
  }

  @Post('compliance/:teamId/users/:userId')
  addComplianceUserToTeam(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
  ) {
    return this.teamService.addComplianceUserToTeam(userId, teamId);
  }

  @Post('procurement/:teamId/users/:userId')
  addProcurementUserToTeam(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
  ) {
    return this.teamService.addProcurementUserToTeam(userId, teamId);
  }

  @Post('accounts-payable/:teamId/users/:userId')
  addAccountsPayableUserToTeam(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
  ) {
    return this.teamService.addAccountsPayableUserToTeam(userId, teamId);
  }

  @Post('org/:orgId/users/:userId')
  addUserToOrg(@Param('orgId') orgId: string, @Param('userId') userId: string) {
    return this.teamService.addUserToOrg(orgId, userId);
  }

  @Post('org/:orgId/invite')
  inviteUserToOrg(@Param('orgId') orgId: string, @Body('email') email: string) {
    return this.teamService.inviteUserToOrg(orgId, email);
  }

  @Post('create-blank-team')
  async createBlankTeam(
    @Body('user') user: string,
    @Body('organization') organization: string,
  ) {
    return this.teamService.createBlankTeam(user, organization);
  }

  @Post('add-team')
  async addTeam(@Body('team') team: Team, @Body('parentId') parentId: string) {
    return this.teamService.addTeam(team, parentId);
  }

  @Post('create-team-senior-manager')
  async createTeamForSeniorManager(
    @Body('seniorManager') seniorManager: UserDocument,
  ) {
    return this.teamService.createTeamForSeniorManager(seniorManager);
  }

  @Get('next-finance-approver/:teamId/:userId')
  findNextFinanceApprover(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
  ) {
    // Assuming the service expects the team and user documents, you might need to fetch these first
    const team = this.teamService.findOne(teamId);
    const user = this.teamService.findOne(userId);
    return this.teamService.findNextFinanceApprover(team, user);
  }

  @Get('next-compliance-approver/:teamId/:userId')
  findNextComplianceApprover(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
  ) {
    const team = this.teamService.findOne(teamId);
    const user = this.teamService.findOne(userId);
    return this.teamService.findNextComplianceApprover(team, user);
  }

  @Get('next-procurement-approver/:teamId/:userId')
  findNextProcurementApprover(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
  ) {
    const team = this.teamService.findOne(teamId);
    const user = this.teamService.findOne(userId);
    return this.teamService.findNextProcurementApprover(team, user);
  }

  @Get('next-accounts-payable-approver/:teamId/:userId')
  findNextAccountsPayableApprover(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
  ) {
    const team = this.teamService.findOne(teamId);
    const user = this.teamService.findOne(userId);
    return this.teamService.findNextAccountsPayableApprover(team, user);
  }
}
