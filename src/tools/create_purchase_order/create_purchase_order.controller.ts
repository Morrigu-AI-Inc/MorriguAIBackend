import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ToolDescription } from 'src/db/schemas';
import * as tool_json from './create_purchase_order.json';
import { PurchaseOrderDocument } from 'src/db/schemas/PurchaseOrder';

@Controller('tools/create_purchase_order')
export class CreatePurchaseOrderController {
  constructor(
    @InjectModel('ToolDescription')
    private toolDescriptionModel: Model<ToolDescription>,
    @InjectModel('PurchaseOrder')
    private purchaseOrderModel: Model<PurchaseOrderDocument>,
  ) {
    const tool = this.toolDescriptionModel
      .findOne({
        name: 'tools/create_purchase_order',
      })
      .then(async (tool) => {
        if (!tool) {
          return this.toolDescriptionModel.create(tool_json);
        } else {
          try {
            await this.toolDescriptionModel.findOneAndUpdate(
              { name: 'tools/create_purchase_order' },
              tool_json,
              { new: true },
            );
          } catch (error) {
            console.log(error.message);
            if (error instanceof Error) {
              console.log(error.message);
            }
          }

          return tool;
        }
      });
  }
  @Get()
  async getPurchaseOrder(@Query('po_number') po_number: string) {
    return this.purchaseOrderModel.findOne({ po_number: po_number });
  }

  @Post()
  async createPurchaseOrder(@Body() purchaseOrder: PurchaseOrderDocument) {
    return this.purchaseOrderModel.create(purchaseOrder);
  }
}
