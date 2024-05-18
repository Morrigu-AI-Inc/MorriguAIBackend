import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Organization } from './Organization';

@Schema()
export class FixedAsset extends Document {
  @Prop({ required: true })
  assetName: string; // Name of the asset

  @Prop({ required: true })
  purchaseDate: Date; // Date the asset was purchased

  @Prop({ required: true })
  purchasePrice: number; // Initial cost of the asset

  @Prop()
  lifespan: number; // Expected useful life of the asset in years

  @Prop({ required: true })
  salvageValue: number; // Estimated value of the asset at the end of its useful life

  @Prop({ type: Types.ObjectId, ref: 'Organization' })
  owner: Organization; // Link to the organization that owns the asset

  @Prop()
  depreciationMethod: string; // Method of depreciation: 'Straight-Line', 'Declining Balance', etc.

  @Prop()
  currentValue: number; // Current book value of the asset
}

export const FixedAssetSchema = SchemaFactory.createForClass(FixedAsset);
