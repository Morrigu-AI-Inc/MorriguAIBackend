import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { Warehouse, WarehouseDocument } from 'src/db/schemas/Warehouse';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectModel(Warehouse.name) private readonly warehouseModel: Model<WarehouseDocument>,
  ) {}

  async create(createWarehouseDto: CreateWarehouseDto): Promise<Warehouse> {
    const createdWarehouse = new this.warehouseModel(createWarehouseDto);
    return createdWarehouse.save();
  }

  async findAll(): Promise<Warehouse[]> {
    return this.warehouseModel.find().exec();
  }

  async findOne(id: string): Promise<Warehouse> {
    const warehouse = await this.warehouseModel.findById(id).exec();
    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }
    return warehouse;
  }

  async update(id: string, updateWarehouseDto: UpdateWarehouseDto): Promise<Warehouse> {
    const updatedWarehouse = await this.warehouseModel
      .findByIdAndUpdate(id, updateWarehouseDto, { new: true })
      .exec();
    if (!updatedWarehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }
    return updatedWarehouse;
  }

  async remove(id: string): Promise<Warehouse> {
    const deletedWarehouse = await this.warehouseModel.findByIdAndDelete(id).exec();
    if (!deletedWarehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }
    return deletedWarehouse;
  }
}
