import { Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from 'src/db/schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel('Employee') private employeeModel: Model<Employee>,
  ) {}
  create(createEmployeeDto: CreateEmployeeDto) {
    delete createEmployeeDto._id
    console.log('createEmployeeDto', createEmployeeDto);
    const employee = this.employeeModel.create(createEmployeeDto);

    return employee;
  }

  findAll() {
    return this.employeeModel.find();
  }

  findOne(id: number) {
    return {
      _id: id,
      name: 'John Doe',
      email: 'test',
    };
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return {
      message: 'Employee updated successfully',
      data: updateEmployeeDto,
    };
  }

  remove(id: number) {
    return {
      message: 'Employee deleted successfully',
      data: id,
    };
  }
}
