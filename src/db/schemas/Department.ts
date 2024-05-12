import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseDocument } from './BaseDocument';

export type DepartmentDocument = Department & Document;

@Schema({
  timestamps: true,
  versionKey: 'version',
})
export class Department extends BaseDocument {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  manager: Types.ObjectId; // Assumes an Employee schema exists for manager references

  @Prop({ required: true })
  description: string;

  @Prop([{ type: Types.ObjectId, ref: 'Department' }])
  subdepartments: Department[];

  @Prop({ required: true })
  goals: string[];

  @Prop({ required: true })
  budget: number;

  @Prop([{ type: Types.ObjectId, ref: 'Role' }])
  roles: Types.ObjectId[]; // Assumes a Role schema exists for role definitions within the department
}

const DepartmentSchema = SchemaFactory.createForClass(Department);

export default DepartmentSchema;
