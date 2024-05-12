import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Department, DepartmentDocument } from 'src/db/schemas';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';



@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel(Department.name)
    private departmentModel: Model<DepartmentDocument>,
  ) {}

  // Create a new department
  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const newDepartment = new this.departmentModel(createDepartmentDto);
    return newDepartment.save();
  }

  // Retrieve all departments
  async findAll(): Promise<Department[]> {
    return this.departmentModel.find().exec();
  }

  // Retrieve a single department by id
  async findOne(id: string): Promise<Department> {
    const department = await this.departmentModel.findById(id).exec();
    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
    return department;
  }

  // Update a department by id
  async update(
    id: string,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    const updatedDepartment = await this.departmentModel
      .findByIdAndUpdate(id, updateDepartmentDto, { new: true })
      .exec();
    if (!updatedDepartment) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
    return updatedDepartment;
  }

  // Delete a department by id
  async remove(id: string): Promise<void> {
    const result = await this.departmentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
  }
}
