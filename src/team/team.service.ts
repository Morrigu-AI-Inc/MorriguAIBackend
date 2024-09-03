import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Group,
  Organization,
  OrganizationDocument,
  RootOrgGroup,
  Team,
  User,
  UserACL,
  UserDocument,
} from 'src/db/schemas';
import { MailerService } from 'src/mailer/mailer.service';
import { Invitation } from 'src/db/schemas/Invitation';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel('Team')
    private readonly teamModel: Model<Team>,
    @InjectModel('Group')
    private readonly groupModel: Model<Group>,
    @InjectModel('Organization')
    private readonly organizationModel: Model<Organization>,
    @InjectModel('User')
    private readonly userModel: Model<User>,
    @InjectModel('RootOrgGroup')
    private readonly rootOrgGroupModel: Model<RootOrgGroup>,
    private readonly mailService: MailerService,
    @InjectModel('Invitation')
    private readonly invitationModel: Model<Invitation>,
    @InjectModel('UserACL')
    private readonly aclModel: Model<UserACL>,
  ) {
    // this.initModule();
  }

  async initModule() {
    const organizations = await this.organizationModel.find({});

    for (const org of organizations) {
      const owner = org.owner;

      this.createBlankTeam(owner.toString(), org._id.toString());
    }
  }

  async getUsersOfOrg(orgId: string) {
    const org = await this.organizationModel.findOne({ _id: orgId });

    if (!org) {
      throw new Error('Organization not found');
    }

    const users = await this.userModel.find({
      _id: {
        $in: org.users,
      },
    });

    return users;
  }

  async inviteUserToOrganization(orgId: string, email: string) {
    const org = await this.organizationModel.findOne({ _id: orgId });

    if (!org) {
      throw new Error('Organization not found');
    }

    // send email to user
    this.mailService.sendMail({
      from: {
        name: 'Procurement App',
        address: 'jason@morrigu.ai',
      },
      to: [email],
      subject: 'You have been invited to join an organization',
      text: 'You have been invited to join an organization',
      category: 'invite',
      sandbox: true,
    });

    return {
      message: 'User invited to organization',
      email,
    };
  }

  // {
  //   name: 'asd',
  //   managerId: '665760fa32a41b8769a79c76',
  //   seniorManagerId: '665760fa32a41b8769a79c76',
  //   users: [ '665760fa32a41b8769a79c76' ],
  //   teams: [ '665760fa32a41b8769a79c76' ],
  //   parentTeam: '6657613c32a41b8769a79eba'
  // }
  async create(createTeamDto: CreateTeamDto) {
    const team = await this.teamModel.create({
      ...createTeamDto,
    });

    if (!team) {
      throw new Error('Failed to create team');
    }

    // add team to org root group
    const org = await this.organizationModel.findOne({
      _id: createTeamDto.parentTeam,
    });

    if (!org) {
      throw new Error('Organization not found');
    }

    const rootOrgGroupId = org.rootOrgGroup as RootOrgGroup;

    const rootOrgGroup = await this.rootOrgGroupModel.findOne({
      _id: rootOrgGroupId,
    });

    if (!rootOrgGroup) {
      throw new Error('Root org group not found');
    }

    rootOrgGroup.teams.push(team._id);

    await rootOrgGroup.save();

    return {
      message: 'Team created successfully',
      data: createTeamDto,
    };
  }

  async findAll(orgId: string) {
    // find the org
    const org = await this.organizationModel.findOne({ _id: orgId });

    if (!org) {
      throw new Error('Organization not found');
    }

    const rootOrgGroup = await this.rootOrgGroupModel.findOne({
      _id: org.rootOrgGroup,
    });

    if (!rootOrgGroup) {
      throw new Error('Root org group not found');
    }

    const teams = await this.teamModel
      .find({
        _id: {
          $in: rootOrgGroup.teams,
        },
      })
      .populate('users')
      .populate('teams')
      .populate('financeGroup')
      .populate('complianceGroup')
      .populate('procurementGroup')
      .populate('accountsPayableGroup');

    if (!teams) {
      return [];
    }

    return teams;
  }

  findOne(id: string): any {
    const team = this.teamModel.findOne({ _id: id });

    if (!team) {
      throw new Error('Team not found');
    }

    return team;
  }

  async update(id: string, updateTeamDto: UpdateTeamDto) {
    console.log(updateTeamDto);
    // {
    //   name: 'Team Name',
    //   managerId: '665760fa32a41b8769a79c76',
    //   seniorManagerId: '665760fa32a41b8769a79c76',
    //   parentTeam: '6657613c32a41b8769a79eba',
    //   financeGroup: '66d62b0de2f0251323776ea4',
    //   complianceGroup: '66d62bd6ec3fc9418530f8b7',
    //   procurementGroup: '66d62bedec3fc9418530f92f',
    //   accountsPayableGroup: '66d62c0fec3fc9418530fa05'
    // }
    const team = await this.teamModel.findOne({ _id: id });

    if (!team) {
      throw new Error('Team not found');
    }

    if (updateTeamDto.name) {
      team.name = updateTeamDto.name;
    }

    if (updateTeamDto.managerId) {
      team.managerId = new Types.ObjectId(updateTeamDto.managerId);
    }

    if (updateTeamDto.seniorManagerId) {
      team.seniorManagerId = new Types.ObjectId(updateTeamDto.seniorManagerId);
    }

    if (updateTeamDto.financeGroup) {
      team.financeGroup = await this.groupModel.findOne({
        _id: updateTeamDto.financeGroup,
      });
    }

    if (updateTeamDto.complianceGroup) {
      team.complianceGroup = await this.groupModel.findOne({
        _id: updateTeamDto.complianceGroup,
      });
    }

    if (updateTeamDto.procurementGroup) {
      team.procurementGroup = await this.groupModel.findOne({
        _id: updateTeamDto.procurementGroup,
      });
    }

    if (updateTeamDto.accountsPayableGroup) {
      team.accountsPayableGroup = await this.groupModel.findOne({
        _id: updateTeamDto.accountsPayableGroup,
      });
    }

    await team.save();

    return team;
  }

  remove(id: string) {
    return {
      message: 'Team deleted successfully',
      data: id,
    };
  }

  public async createBlankTeam(user: string, organization: string) {
    // find both the user and the organization

    const userDoc = await this.userModel.findOne({ _id: user });

    if (!userDoc) {
      throw new Error('User not found');
    }

    const organizationDoc = await this.organizationModel.findOne({
      _id: organization,
    });

    if (!organizationDoc) {
      throw new Error('Organization not found');
    }

    // create root org group

    const ownerGroup = await this.groupModel.create({
      name: 'owner',
      users: [userDoc._id],
    });

    const financeGroup = await this.groupModel.create({
      name: 'finance',
      users: [userDoc._id],
    });

    const complianceGroup = await this.groupModel.create({
      name: 'compliance',
      users: [userDoc._id],
    });

    const procurementGroup = await this.groupModel.create({
      name: 'procurement',
      users: [userDoc._id],
    });

    const accountsPayableGroup = await this.groupModel.create({
      name: 'accountsPayable',
      users: [userDoc._id],
    });

    const rog = await this.rootOrgGroupModel.create({
      name: 'root',
      managerId: userDoc._id,
      seniorManagerId: userDoc._id,
      ownerGroup: ownerGroup._id,
      financeGroup: financeGroup._id,
      complianceGroup: complianceGroup._id,
      procurementGroup: procurementGroup._id,
      accountsPayableGroup: accountsPayableGroup._id,
    });

    const org = await this.organizationModel.findOne({
      _id: organizationDoc._id,
    });

    if (!org) {
      throw new Error('Organization not found');
    }

    org.rootOrgGroup = rog._id;

    await org.save();

    return org;
  }

  // given the requesters team and the current persons ID, can they approve the PO?
  public findNextFinanceApprover(team: Team, user: UserDocument) {
    const financeGroup = team.financeGroup as Group;

    if (financeGroup.users.includes(user._id)) {
      return user;
    }

    if (team.parentTeam) {
      return this.findNextFinanceApprover(team.parentTeam, user);
    }

    return null;
  }

  public findNextComplianceApprover(team: Team, user: UserDocument) {
    const complianceGroup = team.complianceGroup as Group;

    if (complianceGroup.users.includes(user._id)) {
      return user;
    }

    if (team.parentTeam) {
      return this.findNextComplianceApprover(team.parentTeam, user);
    }

    return null;
  }

  public findNextProcurementApprover(team: Team, user: UserDocument) {
    const procurementGroup = team.procurementGroup as Group;

    if (procurementGroup.users.includes(user._id)) {
      return user;
    }

    if (team.parentTeam) {
      return this.findNextProcurementApprover(team.parentTeam, user);
    }

    return null;
  }

  public findNextAccountsPayableApprover(team: Team, user: UserDocument) {
    const accountsPayableGroup = team.accountsPayableGroup as Group;

    if (accountsPayableGroup.users.includes(user._id)) {
      return user;
    }

    if (team.parentTeam) {
      return this.findNextAccountsPayableApprover(team.parentTeam, user);
    }

    return null;
  }

  async addTeam(team: Team, parentId: string) {
    // create the new team and add it to the parent team

    const newTeam = await this.teamModel.create(team);

    const parentTeam = await this.teamModel.findOne({ _id: parentId });

    if (!parentTeam) {
      throw new Error('Parent team not found');
    }

    team.parentTeam = parentTeam;

    await team.save();

    parentTeam.teams.push(team);

    await parentTeam.save();

    return team;
  }

  public createTeamForSeniorManager(seniorManager: UserDocument) {
    // find the team the senior manager is a "user" of
    const seniorTeam = this.teamModel.findOne({ users: seniorManager._id });

    // create a team for the senior manager
    const team = new this.teamModel({
      managerId: seniorManager._id,
      seniorManagerId: seniorManager._id,
      users: [seniorManager._id],
      parentTeam: seniorTeam,
    });
  }

  /// add user to team

  async addUserToTeam(teamId: string, users: string[]) {
    console.log(users);
    // Ensure teamId is a valid ObjectId
    if (!Types.ObjectId.isValid(teamId)) {
      throw new Error('Invalid team ID');
    }

    // Ensure that all user IDs are valid ObjectIds
    const invalidUserIds = users.filter(
      (userId) => !Types.ObjectId.isValid(userId),
    );
    if (invalidUserIds.length > 0) {
      throw new Error(`Invalid user IDs: ${invalidUserIds.join(', ')}`);
    }

    // Find the team by ID
    const team = await this.teamModel.findById(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    // Find the users whose IDs are in the users array
    const usersDoc = await this.userModel.find({
      _id: {
        $in: users.map((userId) => new Types.ObjectId(userId)),
      },
    });

    if (usersDoc.length === 0) {
      throw new Error('No valid users found');
    }

    // Add user IDs to the team, ensuring no duplicates
    team.users = [...new Set([...team.users, ...usersDoc.map((u) => u._id)])];

    console.log(team.users);
    await team.save();

    return team;
  }

  async addUserToGroupOnTeam(groupId: string, userId: string, teamId: string) {
    const team = await this.teamModel.findOne({
      _id: teamId,
    });

    if (!team) {
      throw new Error('Team not found');
    }

    const group = await this.groupModel.findOne({
      _id: groupId,
    });

    if (!group) {
      throw new Error('Group not found');
    }

    const user = await this.userModel.findOne({
      _id: userId,
    });

    if (!user) {
      throw new Error('User not found');
    }

    group.users.push(user._id);

    await group.save();

    return group;
  }

  // add to finance group
  async addFinanceUserToTeam(userId: string, teamId: string) {
    const team = await this.teamModel.findOne({
      _id: teamId,
    });

    if (!team) {
      throw new Error('Team not found');
    }

    const financeGroup = team.financeGroup as Group;

    if (!financeGroup) {
      throw new Error('Finance group not found');
    }

    // if there is no finance group we need to create one
    if (!financeGroup) {
      const newFinanceGroup = await this.groupModel.create({
        name: 'finance',
        users: [userId],
      });

      team.financeGroup = newFinanceGroup;

      await team.save();

      return newFinanceGroup;
    }

    financeGroup.users.push(userId as any);

    await financeGroup.save();

    return financeGroup;
  }

  // add to compliance group
  async addComplianceUserToTeam(userId: string, teamId: string) {
    const team = await this.teamModel.findOne({
      _id: teamId,
    });

    if (!team) {
      throw new Error('Team not found');
    }

    const complianceGroup = team.complianceGroup as Group;

    if (!complianceGroup) {
      throw new Error('Compliance group not found');
    }

    // if there is no compliance group we need to create one
    if (!complianceGroup) {
      const newComplianceGroup = await this.groupModel.create({
        name: 'compliance',
        users: [userId],
      });

      team.complianceGroup = newComplianceGroup;

      await team.save();

      return newComplianceGroup;
    }

    complianceGroup.users.push(userId as any);

    await complianceGroup.save();

    return complianceGroup;
  }

  // add to procurement group
  async addProcurementUserToTeam(userId: string, teamId: string) {
    const team = await this.teamModel.findOne({
      _id: teamId,
    });

    if (!team) {
      throw new Error('Team not found');
    }

    const procurementGroup = team.procurementGroup as Group;

    if (!procurementGroup) {
      throw new Error('Procurement group not found');
    }

    // if there is no procurement group we need to create one
    if (!procurementGroup) {
      const newProcurementGroup = await this.groupModel.create({
        name: 'procurement',
        users: [userId],
      });

      team.procurementGroup = newProcurementGroup;

      await team.save();

      return newProcurementGroup;
    }

    procurementGroup.users.push(userId as any);

    await procurementGroup.save();

    return procurementGroup;
  }

  // add to accounts payable group
  async addAccountsPayableUserToTeam(userId: string, teamId: string) {
    const team = await this.teamModel.findOne({
      _id: teamId,
    });

    if (!team) {
      throw new Error('Team not found');
    }

    const accountsPayableGroup = team.accountsPayableGroup as Group;

    if (!accountsPayableGroup) {
      throw new Error('Accounts payable group not found');
    }

    // if there is no accounts payable group we need to create one
    if (!accountsPayableGroup) {
      const newAccountsPayableGroup = await this.groupModel.create({
        name: 'accountsPayable',
        users: [userId],
      });

      team.accountsPayableGroup = newAccountsPayableGroup;

      await team.save();

      return newAccountsPayableGroup;
    }

    accountsPayableGroup.users.push(userId as any);

    await accountsPayableGroup.save();

    return accountsPayableGroup;
  }

  // remove from team
  async removeUserFromTeam(teamId: string, userId: string) {
    // when we remove a user from the team they are only remove from the team, not the other teams or groups in the org
    // so we will one remove the user from the team and then remove the user from the groups in the team

    const team = await this.teamModel
      .findOne({
        _id: teamId,
      })
      .populate(
        'financeGroup complianceGroup procurementGroup accountsPayableGroup',
      );

    if (!team) {
      throw new Error('Team not found');
    }

    const user = await this.userModel.findOne({
      _id: userId,
    });

    if (!user) {
      throw new Error('User not found');
    }

    console.log('TEAM', team);

    team.users = team.users.filter((u) => u.toString() !== user._id.toString());

    console.log('TEAM', team.users);

    await team.save();

    // remove user from groups
    if (team.financeGroup) {
      const financeGroup = team.financeGroup as Group;

      financeGroup.users = financeGroup.users.filter(
        (u) => u.toString() !== user._id.toString(),
      );

      await financeGroup.save();
    }

    if (team.complianceGroup) {
      const complianceGroup = team.complianceGroup as Group;

      complianceGroup.users = complianceGroup.users.filter(
        (u) => u.toString() !== user._id.toString(),
      );

      await complianceGroup.save();
    }

    if (team.procurementGroup) {
      const procurementGroup = team.procurementGroup as Group;

      procurementGroup.users = procurementGroup.users.filter(
        (u) => u.toString() !== user._id.toString(),
      );

      await procurementGroup.save();
    }

    if (team.accountsPayableGroup) {
      const accountsPayableGroup = team.accountsPayableGroup as Group;

      accountsPayableGroup.users = accountsPayableGroup.users.filter(
        (u) => u.toString() !== user._id.toString(),
      );

      await accountsPayableGroup.save();
    }

    return team;
  }

  // add to org
  async addUserToOrg(orgId: string, userId: string) {
    const org = await this.organizationModel.findOne({
      _id: orgId,
    });

    if (!org) {
      throw new Error('Organization not found');
    }

    const user = await this.userModel.findOne({
      _id: userId,
    });

    if (!user) {
      throw new Error('User not found');
    }

    org.users.push(user._id);

    await org.save();

    return org;
  }

  async getInvitationById(invitationId: string) {
    const invitation = await this.invitationModel.findOne({
      _id: invitationId,
    });

    if (!invitation) {
      throw new Error('Invitation not found');
    }

    return invitation;
  }

  async getInvitations(orgId: string) {
    const org = await this.organizationModel.findOne({
      _id: orgId,
    });

    console.log(org);

    if (!org) {
      throw new Error('Organization not found');
    }

    const invitations = await this.invitationModel.find({
      organization: org._id,
    });

    return invitations;
  }

  //   invitationId 66d4f3a4547efb50ff278e24
  // body {
  //   session: {
  //     user: {
  //       providerAccountId: 'google-oauth2|105187225310842618342',
  //       provider: 'auth0',
  //       given_name: 'Jason',
  //       family_name: 'Walker',
  //       nickname: 'jason.dee.walker',
  //       updatedAt: '2024-09-01T23:08:11.492Z',
  //       email_verified: true,
  //       image: 'https://lh3.googleusercontent.com/a/ACg8ocJUnwHOBB0FQfXoyanHWoP_PmTBVBeiIka6OdziD1Zp3n60sw=s96-c',
  //       scope: 'openid profile email',
  //       type: 'oauth',
  //       user_id: 'google-oauth2|105187225310842618342'
  //     },
  //     expires: '2024-10-01T23:19:14.728Z',
  //     sub: 'google-oauth2|105187225310842618342',
  //     type: 'oauth',
  //     providerAccountId: 'google-oauth2|105187225310842618342',
  //     provider: 'auth0',
  //     access_token: 'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIiwiaXNzIjoiaHR0cHM6Ly9kZXYtbW9ycmlndS51cy5hdXRoMC5jb20vIn0..5pYFp9MttU64zx-6.0R1hDxGVHwxKJCkzC0Rl1sDe37z1IFXsIHLMyMFBFCpUJD7zsTBWei2dFFvti6sf0-BeWW39vkzXBca3sSArNW0F6KDdD4YemoX53qRl3TNsRMRHvylLwRcQjxq-iuHSzMpXyIVBMA69Bm2LRwJu4w5-T7DSnnaiGZi2Qk-IOKFWj9IT_88LFeJF6qRTyM6QYmZhR4Pc7G20-MXT9jTXNhcJTBHlUvd4MA8tBtiKqMICqiRJAa_RKyKFTtBficL_Esp6XM-UfZg7NwHDgd8BnJ8jdHxRoJ7G5ar3A4PW06gfmm2EK8dnj7tVwDdU4GCPj8WIP90.lNOVjK__27p7qReE-wK4aw',
  //     id_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjVocHM5TjRRVnJlZEhYMGpuRExfSCJ9.eyJhcHBfbWV0YWRhdGEiOnt9LCJnaXZlbl9uYW1lIjoiSmFzb24iLCJmYW1pbHlfbmFtZSI6IldhbGtlciIsIm5pY2tuYW1lIjoiamFzb24uZGVlLndhbGtlciIsIm5hbWUiOiJKYXNvbiBXYWxrZXIiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSlVud0hPQkIwRlFmWG95YW5IV29QX1BtVEJWQmVpSWthNk9kemlEMVpwM242MHN3PXM5Ni1jIiwidXBkYXRlZF9hdCI6IjIwMjQtMDktMDFUMjM6MDg6MTEuNDkyWiIsImVtYWlsIjoiamFzb24uZGVlLndhbGtlckBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly9kZXYtbW9ycmlndS51cy5hdXRoMC5jb20vIiwiYXVkIjoiRHRSRkhzS3hhY25MM3RoVURPdGFUV0I1TXZhT1diUHkiLCJpYXQiOjE3MjUyMzIwOTQsImV4cCI6MTcyNTI2ODA5NCwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDUxODcyMjUzMTA4NDI2MTgzNDIiLCJzaWQiOiJfeV9hSEFsMjhNVldCTzdJZHEtaHBIYUl5NkdMVy12dSJ9.KP1gAxRB9FRByRDOR9UQfR_Tupz-nv2zSEFrhbSexwQAufCMxb5mb1IC8g7yPBV9cqFfRK183R2NF5oOLHkpB-qBdJZngfLRkkqR6uazFGNqKhO_CC_XhDfA7qxp0QMm9YbKGGEphS1xHNEnZjegfBsakNr-sJi3xK_5AQqT62k_tuxxyMKDzVSqJgch4CMweJLLsjApTVwu85gm6hgmQMdUk3i79vQbuXEiYBPz48UIrH6WvFw5JrPAw8rY8125be87_CpZGqg4OtiPqi7s-hbG1CKeDERPafCEzC89rkFrCZDvC5BSWFDJ-9i9ZDnqoC_Fl9yXIwjLyO02Oi3v_Q',
  //     scope: 'openid profile email',
  //     expires_at: 1725318494,
  //     token_type: 'Bearer',
  //     given_name: 'Jason',
  //     family_name: 'Walker',
  //     nickname: 'jason.dee.walker',
  //     updated_at: '2024-09-01T23:08:11.492Z',
  //     email_verified: true,
  //     image: 'https://lh3.googleusercontent.com/a/ACg8ocJUnwHOBB0FQfXoyanHWoP_PmTBVBeiIka6OdziD1Zp3n60sw=s96-c',
  //     user_id: 'google-oauth2|105187225310842618342',
  //     iat: 1725232546,
  //     exp: 1727824546,
  //     jti: 'd8ae54f2-b26c-45d9-a972-b453b00fe1c3',
  //     organizations: {},
  //     supplier: {}
  //   }
  // }
  async acceptInvitation(invitationId: string, body: any) {
    const invitation = await this.invitationModel.findOne({
      _id: invitationId,
    });

    if (!invitation) {
      throw new Error('Invitation not found');
    }

    if (invitation.status !== 'pending') {
      throw new Error('Invitation has already been accepted');
    }

    invitation.status = 'accepted';

    const user = await this.userModel.create({
      id: body.session.user.user_id,
      provider: body.session.provider,
      email: invitation.email,
      name: `${body.session.user.given_name} ${body.session.user.family_name}`,
      data: {
        ...body.session,
        email: invitation.email,
      },
    });

    if (!user) {
      throw new Error('Failed to create user');
    }

    // add user to the org
    const res = await this.addUserToOrg(
      invitation.organization.toString(),
      user._id.toString(),
    );

    if (!res) {
      throw new Error('Failed to add user to org');
    }

    const acl = await this.aclModel.create({
      departmentManager: res.owner,
      seniorManager: res.owner,
      financeController: res.owner,
      complianceOfficer: res.owner,
      procurementOfficer: res.owner,
    });

    if (!acl) {
      throw new Error('Failed to create ACL');
    }

    user.acl = acl;

    await user.save();

    return {
      message: 'Invitation accepted',
      user,
    };
  }

  // invite user to org
  async inviteUserToOrg(orgId: string, email: string) {
    const org = await this.organizationModel.findOne({
      _id: orgId,
    });

    if (!org) {
      throw new Error('Organization not found');
    }

    const invitation = await this.invitationModel.create({
      email,
      organization: org._id,
      invitedBy: org.owner,
      status: 'pending',
      invitationCode: email + Date.now().toString(),
    });

    if (!invitation) {
      throw new Error('Failed to create invitation');
    }

    const inviteLink = `${process.env.FRONTEND_URL}/login?invitation=${invitation._id}`;

    // send email to user
    const sent = this.mailService.sendMail({
      from: {
        address: 'mailtrap@rigu.ai',
        name: 'Mailtrap Test',
      },
      to: [email],
      subject: 'You have been invited to join an organization',
      text: `
      <html>
      <body>
        <p>You have been invited to join the ${org.name} organization</p>
        <p>Click the link below to accept the invitation</p>
        <a href="${inviteLink}">Accept Invitation</a>
      </body>
      </html>`,
      category: 'invite',
    });

    if (!sent) {
      throw new Error('Failed to send email');
    }

    // create a invite to the org system that the user can accept

    return {
      message: 'User invited to org',
      email,
    };
  }

  async getGroupsOnTeam(teamId: string) {
    const team = await this.teamModel
      .findOne({
        _id: teamId,
      })
      .populate('groups');

    if (!team) {
      throw new Error('Team not found');
    }

    return team.groups || [];
  }

  async getUsersOnTeam(teamId: string) {
    const team = await this.teamModel
      .findOne({
        _id: teamId,
      })
      .populate('users');

    if (!team) {
      throw new Error('Team not found');
    }

    return team.users || [];
  }

  async addGroupToTeam(teamId: string, groupDto: Group) {
    const team = await this.teamModel.findOne({
      _id: teamId,
    });

    if (!team) {
      throw new Error('Team not found');
    }

    const group = await this.groupModel.create(groupDto);

    if (!group) {
      throw new Error('Failed to create group');
    }

    team.groups.push(group._id);

    await team.save();

    return group;
  }

  async addTeamToTeam(teamId: string, teamDto: Team) {
    console.log(teamDto);
    const team = await this.teamModel.findOne({
      _id: teamId,
    });

    if (!team) {
      throw new Error('Team not found');
    }

    // {
    //   name: 'zSnoyhrt',
    //   managerId: '66d4f94385bb0485a7ae73cf',
    //   seniorManagerId: '665760fa32a41b8769a79c76',
    //   parentTeam: '66d60439e51ef15e301aace3'
    // }

    const newTeam = await this.teamModel.create({
      name: teamDto.name,
      managerId: teamDto.managerId,
      seniorManagerId: teamDto.seniorManagerId,
      parentTeam: team._id,
    });

    if (!newTeam) {
      throw new Error('Failed to create team');
    }

    team.teams.push(newTeam._id);

    await team.save();

    return newTeam;
  }

  async addUserToGroup(groupId: string, userId: string) {
    const group = await this.groupModel.findOne({
      _id: groupId,
    });

    if (!group) {
      throw new Error('Group not found');
    }

    const user = await this.userModel.findOne({
      _id: userId,
    });

    if (!user) {
      throw new Error('User not found');
    }

    group.users.push(user._id);

    await group.save();

    return group;
  }

  async getApprovalGroups(teamId: string) {
    const team = await this.teamModel
      .findOne({
        _id: teamId,
      })
      .populate('financeGroup')
      .populate('complianceGroup')
      .populate('procurementGroup')
      .populate('accountsPayableGroup')

    if (!team) {
      throw new Error('Team not found');
    }

    // populate the users in the groups
    await team.financeGroup?.populate('users');
    await team.complianceGroup?.populate('users')
    await team.procurementGroup?.populate('users')
    await team.accountsPayableGroup?.populate('users')


    return {
      financeGroup: team.financeGroup,
      complianceGroup: team.complianceGroup,
      procurementGroup: team.procurementGroup,
      accountsPayableGroup: team.accountsPayableGroup,
    };
  }

  async updateGroup(groupId: string, groupDto: Group) {
    const group = await this.groupModel.findOne({
      _id: groupId,
    });

    if (!group) {
      throw new Error('Group not found');
    }

    if (groupDto.name) {
      group.name = groupDto.name;
    }

    if (groupDto.users) {
      const user = await this.userModel.find({
        _id: {
          $in: groupDto.users,
        },
      });

      group.users = groupDto.users;
    }

    await group.save();

    return group;
  }
}
