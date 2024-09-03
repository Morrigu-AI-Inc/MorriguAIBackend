  //   name: 'asd',
  //   managerId: '665760fa32a41b8769a79c76',
  //   seniorManagerId: '665760fa32a41b8769a79c76',
  //   users: [ '665760fa32a41b8769a79c76' ],
  //   teams: [ '665760fa32a41b8769a79c76' ],
  //   parentTeam: '6657613c32a41b8769a79eba'
export class CreateTeamDto {
    name: string;
    managerId: string;
    seniorManagerId: string;
    users: string[];
    teams: string[];
    parentTeam: string;
    financeGroup: string;
    complianceGroup: string;
    procurementGroup: string;
    accountsPayableGroup: string;
}
