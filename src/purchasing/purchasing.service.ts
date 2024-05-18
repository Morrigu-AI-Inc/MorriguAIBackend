import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePurchasingDto } from './dto/create-purchasing.dto';
import { UpdatePurchasingDto } from './dto/update-purchasing.dto';
import { PurchaseOrderDocument, PurchaseOrder } from 'src/db/schemas/PurchaseOrder';


@Injectable()
export class PurchasingService {
  constructor(
    @InjectModel(PurchaseOrder.name) private readonly purchaseOrderModel: Model<PurchaseOrderDocument>,
  ) {}

  async create(createPurchasingDto: CreatePurchasingDto): Promise<PurchaseOrder> {
    const createdPurchaseOrder = new this.purchaseOrderModel(createPurchasingDto);
    return createdPurchaseOrder.save();
  }

  async findAll(): Promise<PurchaseOrder[]> {
    return this.purchaseOrderModel.find().exec();
  }

  async findOne(id: string): Promise<PurchaseOrder> {
    const purchaseOrder = await this.purchaseOrderModel.findById(id).exec();
    if (!purchaseOrder) {
      throw new NotFoundException(`PurchaseOrder with ID ${id} not found`);
    }
    return purchaseOrder;
  }

  async update(id: string, updatePurchasingDto: UpdatePurchasingDto): Promise<PurchaseOrder> {
    const updatedPurchaseOrder = await this.purchaseOrderModel
      .findByIdAndUpdate(id, updatePurchasingDto, { new: true })
      .exec();
    if (!updatedPurchaseOrder) {
      throw new NotFoundException(`PurchaseOrder with ID ${id} not found`);
    }
    return updatedPurchaseOrder;
  }

  async remove(id: string): Promise<PurchaseOrder> {
    const deletedPurchaseOrder = await this.purchaseOrderModel.findByIdAndDelete(id).exec();
    if (!deletedPurchaseOrder) {
      throw new NotFoundException(`PurchaseOrder with ID ${id} not found`);
    }
    return deletedPurchaseOrder;
  }
}
