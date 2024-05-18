import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { ShipmentDocument } from 'src/db/schemas/Shipment';
import { Shipment } from './entities/shipment.entity';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectModel(Shipment.name) private readonly shipmentModel: Model<ShipmentDocument>,
  ) {}

  async create(createShipmentDto: CreateShipmentDto): Promise<Shipment> {
    const createdShipment = new this.shipmentModel(createShipmentDto);
    return createdShipment.save();
  }

  async findAll(): Promise<Shipment[]> {
    return this.shipmentModel.find().exec();
  }

  async findOne(id: string): Promise<Shipment> {
    const shipment = await this.shipmentModel.findById(id).exec();
    if (!shipment) {
      throw new NotFoundException(`Shipment with ID ${id} not found`);
    }
    return shipment;
  }

  async update(id: string, updateShipmentDto: UpdateShipmentDto): Promise<Shipment> {
    const updatedShipment = await this.shipmentModel
      .findByIdAndUpdate(id, updateShipmentDto, { new: true })
      .exec();
    if (!updatedShipment) {
      throw new NotFoundException(`Shipment with ID ${id} not found`);
    }
    return updatedShipment;
  }

  async remove(id: string): Promise<Shipment> {
    const deletedShipment = await this.shipmentModel.findByIdAndDelete(id).exec();
    if (!deletedShipment) {
      throw new NotFoundException(`Shipment with ID ${id} not found`);
    }
    return deletedShipment;
  }
}
