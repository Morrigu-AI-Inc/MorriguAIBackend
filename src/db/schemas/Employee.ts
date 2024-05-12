// src/employees/schemas/employee.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Department } from './Department';

@Schema()
export class Employee extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Team', required: true })
  teamId: Types.ObjectId;

  @Prop({ required: true })
  roleId: string;

  @Prop({ required: true })
  salary: number;

  @Prop({ required: true })
  hireDate: Date;

  @Prop()
  terminationDate: Date;

  @Prop({ required: true })
  payrollTax: number;

  @Prop({ required: true })
  percentBenefits: number;

  @Prop({ required: true })
  dollarBenefits: number;

  @Prop()
  annualIncreasePercent: number;

  @Prop()
  annualIncreaseDate: Date;

  @Prop({ required: true, ref: 'Department', type: Types.ObjectId })
  department: Department;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
