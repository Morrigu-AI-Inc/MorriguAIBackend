import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Location } from './Supplier';
import { Inventory } from './Inventory';

export type WarehouseDocument = Warehouse & Document;

@Schema({
  timestamps: true,
  versionKey: 'version',
})
export class Warehouse extends Document implements Location {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop([{ type: Types.ObjectId, ref: 'Inventory' }])
  inventory: Inventory[];
}

const WarehouseSchema = SchemaFactory.createForClass(Warehouse);

export default WarehouseSchema;
