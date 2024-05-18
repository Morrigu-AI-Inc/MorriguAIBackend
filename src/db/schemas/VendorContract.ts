import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Vendor } from './Vendor';
import { Media } from './Media';

@Schema()
export class VendorContract extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Vendor' })
  vendor: Vendor; // Reference to the Vendor this contract pertains to

  @Prop({ type: Date, default: Date.now })
  startDate: Date; // When the contract starts

  @Prop({ type: Date })
  endDate: Date; // When the contract ends

  @Prop()
  contractTerms: String; // Detailed text of what the contract stipulates

  @Prop({ type: [{ itemName: String, price: Number, unit: String }] })
  items: { itemName: string; price: number; unit: string }[]; // Items or services provided under the contract

  @Prop()
  paymentTerms: String; // Conditions under which payments should be made (e.g., net 30 days)

  @Prop({ type: Boolean, default: false })
  isActive: Boolean; // Whether the contract is currently active

  @Prop()
  notes: String; // Any additional notes or special conditions about the contract

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Media', default: [] }],
  })
  documents: Media[]; // Media files related to the contract
}

export const VendorContractSchema =
  SchemaFactory.createForClass(VendorContract);
