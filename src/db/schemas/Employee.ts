// src/employees/schemas/employee.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Department } from './Department';
import { Role } from './Role';
import { Team } from './Team';

@Schema()
export class Employee extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Team', required: false })
  teamId: Team;

  @Prop({ required: false })
  name: string;

  @Prop({ required: false, type: Types.ObjectId, ref: 'Role' })
  roleId: Role;

  @Prop({ required: false })
  salary: number;

  @Prop({ required: false })
  hireDate: Date;

  @Prop({ required: false })
  terminationDate: Date;

  @Prop({ required: false })
  payrollTax: number;

  @Prop({ required: false })
  percentBenefits: number;

  @Prop({ required: false })
  dollarBenefits: number;

  @Prop()
  annualIncreasePercent: number;

  @Prop()
  annualIncreaseDate: Date;

  @Prop({ required: false, ref: 'Department', type: Types.ObjectId })
  department: Department;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
