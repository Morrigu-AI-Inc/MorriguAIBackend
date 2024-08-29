import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePurchasingDto } from './dto/create-purchasing.dto';
import { UpdatePurchasingDto } from './dto/update-purchasing.dto';
import {
  PurchaseOrderDocument,
  PurchaseOrder,
  POStatus,
} from 'src/db/schemas/PurchaseOrder';
import { LineItem, LineItemDocument } from 'src/db/schemas/LineItem';

@Injectable()
export class PurchasingService {
  constructor(
    @InjectModel(PurchaseOrder.name)
    private readonly purchaseOrderModel: Model<PurchaseOrderDocument>,
    @InjectModel(LineItem.name)
    private readonly lineItemmodel: Model<LineItemDocument>,
  ) {}

  async create(
    createPurchasingDto: CreatePurchasingDto,
  ): Promise<PurchaseOrder> {
    try {
      // export class PurchaseOrder extends Document {
      //   @Prop({ required: true })
      //   po_number: string;

      //   @Prop({ type: Types.ObjectId, ref: 'Supplier', required: true })
      //   supplier: Supplier;

      //   @Prop({
      //     type: [Types.ObjectId],
      //     ref: 'LineItem',
      //     required: false,
      //     default: [],
      //   })
      //   line_items: object[];

      //   @Prop({ required: true })
      //   orderDate: Date;

      //   @Prop({ required: true })
      //   deliveryDate: Date;

      //   @Prop({ required: true })
      //   totalAmount: number;

      //   @Prop({ required: true, enum: POStatus, default: POStatus.SENT })
      //   status: POStatus;

      //   @Prop({ required: false, type: SchemaTypes.Mixed })
      //   raw: any;

      //   @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
      //   owner: Organization;
      // }

      // create 1 purchase order first then create line items
      const newPo: Partial<PurchaseOrder> = {
        status: POStatus.CREATED,
        po_number: createPurchasingDto.poNumber,
        supplier:
          createPurchasingDto.supplier._id.length > 0
            ? createPurchasingDto.supplier._id
            : null,
        orderDate: new Date(),
        line_items: [],
        totalAmount: createPurchasingDto.items.reduce(
          (acc, item) => acc + item.total,
          0,
        ),
        deliveryDate: new Date(),
        raw: createPurchasingDto,
        owner: createPurchasingDto.owner,
      };

      const createdPurchaseOrder = new this.purchaseOrderModel(newPo);

      if (!createdPurchaseOrder) {
        throw new Error('Failed to create purchase order');
      }

      const lineItems = createPurchasingDto.items.map((item) => ({
        po_number: createdPurchaseOrder._id,
        productName: item.item,
        quantity: item.quantity,
        price: item.unitPrice,
        totalPrice: item.total,
        raw: item,
      }));

      const createdLineItems = await this.lineItemmodel.insertMany(lineItems);

      if (!createdLineItems) {
        throw new Error('Failed to create line items');
      }

      // update the purchase order with the line items so that the line items are linked to the purchase order
      createdPurchaseOrder.line_items = createdLineItems.map(
        (item) => item._id,
      );

      console.log('createdPurchaseOrder', createdPurchaseOrder);

      return createdPurchaseOrder.save();
    } catch (error) {
      console.log(error);
    }
  }

  async findAll(
    owner: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: PurchaseOrder[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
  }> {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const total = await this.purchaseOrderModel
      .find({ owner })
      .countDocuments();
    const totalPages = Math.ceil(total / limit);

    const purchaseOrders = await this.purchaseOrderModel
      .find({
        owner,
      })
      .skip(startIndex)
      .limit(limit)
      // order by created date
      .sort({ createdAt: -1 })
      .populate('supplier')
      .populate('line_items')
      .exec();

    return {
      data: purchaseOrders,
      currentPage: page,
      totalPages: totalPages,
      totalItems: total,
    };
  }

  async findOne(id: string): Promise<PurchaseOrder> {
    const purchaseOrder = await this.purchaseOrderModel.findById(id).exec();
    if (!purchaseOrder) {
      throw new NotFoundException(`PurchaseOrder with ID ${id} not found`);
    }
    return purchaseOrder;
  }

  async update(
    id: string,
    updatePurchasingDto: UpdatePurchasingDto,
  ): Promise<PurchaseOrder> {
    const updatedPurchaseOrder = await this.purchaseOrderModel
      .findByIdAndUpdate(id, updatePurchasingDto, { new: true })
      .exec();
    if (!updatedPurchaseOrder) {
      throw new NotFoundException(`PurchaseOrder with ID ${id} not found`);
    }
    return updatedPurchaseOrder;
  }

  async remove(id: string): Promise<PurchaseOrder> {
    const deletedPurchaseOrder = await this.purchaseOrderModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedPurchaseOrder) {
      throw new NotFoundException(`PurchaseOrder with ID ${id} not found`);
    }
    return deletedPurchaseOrder;
  }
}
