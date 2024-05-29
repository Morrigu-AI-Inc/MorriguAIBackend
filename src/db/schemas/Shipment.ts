import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PurchaseOrder } from './PurchaseOrder';
import { Location } from './Supplier';

export type ShipmentDocument = Shipment & Document;

@Schema({
  timestamps: true,
  versionKey: 'version',
})
export class Shipment extends Document implements Location {
  @Prop({ type: Types.ObjectId, ref: 'PurchaseOrder', required: true })
  purchaseOrder: PurchaseOrder;

  @Prop({ required: true })
  shipmentDate: Date;

  @Prop({ required: true })
  carrier: string;

  @Prop({ required: true })
  trackingNumber: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  address1: string;

  @Prop({ required: false, default: '' })
  address2: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  zip: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;
}

const ShipmentSchema = SchemaFactory.createForClass(Shipment);

export default ShipmentSchema;
