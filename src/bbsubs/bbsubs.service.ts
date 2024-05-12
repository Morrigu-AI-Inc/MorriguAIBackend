import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BBSubsDataPoint } from 'src/db/schemas/BBSubsDataPoint';

@Injectable()
export class BbsubsService {
  constructor(
    @InjectModel('BBSubsDataPoint')
    private readonly bbsubsDataPointModel: Model<BBSubsDataPoint>,
  ) {}

  async findAll(): Promise<BBSubsDataPoint[]> {
    return await this.bbsubsDataPointModel.find().exec();
  }

  async findOne(id: string): Promise<BBSubsDataPoint> {
    return await this.bbsubsDataPointModel.findOne({ _id: id });
  }

  async create(bbsubsDataPoint: BBSubsDataPoint): Promise<BBSubsDataPoint> {
    const newBBSubsDataPoint = new this.bbsubsDataPointModel(bbsubsDataPoint);
    return await newBBSubsDataPoint.save();
  }

  async delete(id: string): Promise<any> {
    return await this.bbsubsDataPointModel.deleteOne({ _id: id });
  }

  async update(
    id: string,
    bbsubsDataPoint: BBSubsDataPoint,
  ): Promise<BBSubsDataPoint> {
    return await this.bbsubsDataPointModel.findByIdAndUpdate(
      id,
      bbsubsDataPoint,
      { new: true },
    );
  }
}
