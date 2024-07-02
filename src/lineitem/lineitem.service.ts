import { Injectable } from '@nestjs/common';
import { CreateLineitemDto } from './dto/create-lineitem.dto';
import { UpdateLineitemDto } from './dto/update-lineitem.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LineItem } from 'src/db/schemas/LineItem';
import {
  PurchaseOrderDocument,
  PurchaseOrder,
} from 'src/db/schemas/PurchaseOrder';
import { Supplier } from 'src/db/schemas/Supplier';
import { Organization } from 'src/db/schemas';

@Injectable()
export class LineitemService {
  constructor(
    @InjectModel('LineItem') private readonly lineitemModel: Model<LineItem>,
    @InjectModel('Supplier') private readonly supplierModel: Model<Supplier>,

    @InjectModel(PurchaseOrder.name)
    private readonly purchaseOrderModel: Model<PurchaseOrderDocument>,
  ) {}
  create(createLineitemDto: CreateLineitemDto) {
    return 'This action adds a new lineitem';
  }

  async createBulk(createLineitemDto: CreateLineitemDto[]) {
    // we need to break the list down into individual line items and suppliers and purchase orders

    // get all the suppliers first
    const suppliers = await this.supplierModel.find({
      name: {
        $in: createLineitemDto.map((lineitem) => lineitem.supplier_name),
      },
    });

    // get all the purchase orders
    const purchaseOrders = await this.purchaseOrderModel.find({
      po_number: {
        $in: createLineitemDto.map((lineitem) => lineitem.po_number),
      },
      owner: '',
    });

    const newSuppliers = createLineitemDto
      .filter(
        (lineitem) =>
          !suppliers.find(
            (supplier) => supplier.name === lineitem.supplier_name,
          ),
      )
      .map((line) => ({
        name: line.supplier_name,
        contactInfo_phone: line.supplier_contact_phone,
        contactInfo_email: line.supplier_contact_email,
        address1: line.supplier_address1,
        address2: line.supplier_address2,
        city: line.supplier_city,
        state: line.supplier_state,
        zip: line.supplier_zip,
        country: line.supplier_country,
        latitude: 0,
        longitude: 0,
        products: [],
        raw: line.raw,
      }))
      .filter(
        (supplier, index, self) =>
          index === self.findIndex((t) => t.name === supplier.name),
      );

    const newSup = await this.supplierModel.insertMany(newSuppliers);

    if (newSup) {
      suppliers.push(...newSup);
    }

    const newPurchaseOrders = createLineitemDto
      .filter(
        (lineitem) =>
          !purchaseOrders.find((po) => po.po_number === lineitem.po_number),
      )
      .map((line) => ({
        po_number: line.po_number,
        supplier: suppliers.find(
          (supplier) => supplier.name === line.supplier_name,
        )._id,
        orderDate: new Date(line.po_creation_date),
        deliveryDate: new Date(0),
        totalAmount: 0,
        status: 'PENDING',
        raw: line.raw,
        owner: line.owner,
      }));

    const temp_pos =
      await this.purchaseOrderModel.insertMany(newPurchaseOrders);

    const lineItemsTemp = createLineitemDto.map((line) => {
      const supplier = suppliers.find(
        (supplier) => supplier.name === line.supplier_name,
      );

      const purchaseOrder = temp_pos.find(
        (po) => po.po_number === line.po_number,
      );

      return {
        po_number: purchaseOrder ? purchaseOrder._id : null, // If purchaseOrder exists, use its _id, otherwise null
        productName: line.product || ' ',
        quantity: parseFloat(line.quantity as any) || 0, // Convert quantity to float
        price:
          parseFloat((line.unit_price as any)?.replace(/[^\d.]/g, '')) || 0, // Convert unit_price to float, removing non-numeric characters
        totalPrice:
          parseFloat((line.line_total as any)?.replace(/[^\d.]/g, '')) || 0, // Convert line_total to float, removing non-numeric characters
        raw: line.raw,
      };
    });

    // add the line items to the purchase orders

    temp_pos.forEach(async (po) => {
      const items = lineItemsTemp.filter((line) => line.po_number === po._id);

      po.line_items = (await this.lineitemModel.insertMany(items)).map(
        (li) => li._id,
      );

      await po.save();
    });

    return await this.purchaseOrderModel
      .find({
        owner: createLineitemDto[0].owner,
      })
      .populate('line_items')
      .exec();
  }

  async findAll(owner: string) {
    return await this.purchaseOrderModel
      .find({
        owner: owner,
      })
      .limit(10)
      .populate('line_items')
      .exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} lineitem`;
  }

  update(id: number, updateLineitemDto: UpdateLineitemDto) {
    return `This action updates a #${id} lineitem`;
  }

  remove(id: number) {
    return `This action removes a #${id} lineitem`;
  }
}
