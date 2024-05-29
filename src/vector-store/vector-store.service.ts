// vector-store.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVectorStoreDto } from './dto/create-vector-store.dto';
import { UpdateVectorStoreDto } from './dto/update-vector-store.dto';
import { VectorStore } from './entities/vector-store.entity';
import { VectorStoreDocument } from 'src/db/schemas/VectorStore';

@Injectable()
export class VectorStoreService {
  constructor(
    @InjectModel(VectorStore.name)
    private vectorStoreModel: Model<VectorStoreDocument>,
  ) {}

  async create(
    createVectorStoreDto: CreateVectorStoreDto,
  ): Promise<VectorStore> {
    const createdVectorStore = new this.vectorStoreModel(createVectorStoreDto);
    return createdVectorStore.save();
  }

  async findAll(): Promise<VectorStore[]> {
    return this.vectorStoreModel.find().exec();
  }

  async findOne(id: string): Promise<VectorStore> {
    const vectorStore = await this.vectorStoreModel.findById(id).exec();
    if (!vectorStore) {
      throw new NotFoundException(`VectorStore #${id} not found`);
    }
    return vectorStore;
  }

  async update(
    id: string,
    updateVectorStoreDto: UpdateVectorStoreDto,
  ): Promise<VectorStore> {
    const existingVectorStore = await this.vectorStoreModel
      .findByIdAndUpdate(id, updateVectorStoreDto, { new: true })
      .exec();

    if (!existingVectorStore) {
      throw new NotFoundException(`VectorStore #${id} not found`);
    }
    return existingVectorStore;
  }

  async remove(id: string): Promise<void> {
    const result = await this.vectorStoreModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`VectorStore #${id} not found`);
    }
  }
}
