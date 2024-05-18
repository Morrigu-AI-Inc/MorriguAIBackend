export class CreateEmployeeDto {
  teamId: string;
  roleId: string;
  name: string;
  salary: number;
  hireDate: Date;
  terminationDate: Date;
  payrollTax: number;
  percentBenefits: number;
  dollarBenefits: number;
  annualIncreasePercent: number;
  annualIncreaseDate: Date;
  department: string;
  _id: string;
}
