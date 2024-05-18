import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRawmaterialDto } from './dto/create-rawmaterial.dto';
import { UpdateRawmaterialDto } from './dto/update-rawmaterial.dto';
import { RawMaterial, RawMaterialDocument } from 'src/db/schemas/RawMaterial';

@Injectable()
export class RawmaterialService {
  constructor(
    @InjectModel(RawMaterial.name)
    private readonly rawMaterialModel: Model<RawMaterialDocument>,
  ) {}

  async create(
    createRawmaterialDto: CreateRawmaterialDto,
  ): Promise<RawMaterial> {
    const createdRawMaterial = new this.rawMaterialModel(createRawmaterialDto);
    return createdRawMaterial.save();
  }

  async findAll(): Promise<RawMaterial[]> {
    return this.rawMaterialModel.find().exec();
  }

  async findOne(id: string): Promise<RawMaterial> {
    const rawMaterial = await this.rawMaterialModel.findById(id).exec();
    if (!rawMaterial) {
      throw new NotFoundException(`RawMaterial with ID ${id} not found`);
    }
    return rawMaterial;
  }

  async update(
    id: string,
    updateRawmaterialDto: UpdateRawmaterialDto,
  ): Promise<RawMaterial> {
    const updatedRawMaterial = await this.rawMaterialModel
      .findByIdAndUpdate(id, updateRawmaterialDto, { new: true })
      .exec();
    if (!updatedRawMaterial) {
      throw new NotFoundException(`RawMaterial with ID ${id} not found`);
    }
    return updatedRawMaterial;
  }

  async remove(id: string): Promise<RawMaterial> {
    const deletedRawMaterial = await this.rawMaterialModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedRawMaterial) {
      throw new NotFoundException(`RawMaterial with ID ${id} not found`);
    }
    return deletedRawMaterial;
  }
}
