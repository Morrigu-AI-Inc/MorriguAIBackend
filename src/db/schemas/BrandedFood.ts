import { Schema, Document } from 'mongoose';

export interface BrandedFood extends Document {
  fdc_id: number;
  brand_owner: string;
  brand_name: string;
  subbrand_name: string;
  gtin_upc: number;
  ingredients: string;
  not_a_significant_source_of: string;
  serving_size: number;
  serving_size_unit: string;
  household_serving_fulltext: string;
  branded_food_category: string;
  data_source: string;
  package_weight: string;
  modified_date: Date;
  available_date: Date;
  market_country: string;
  discontinued_date: Date;
  preparation_state_code: string;
  trade_channel: string;
  short_description: string;
}

export const BrandedFoodSchema = new Schema({
  fdc_id: { type: Number, required: true },
  brand_owner: { type: String, required: true },
  brand_name: { type: String, required: true },
  subbrand_name: { type: String },
  gtin_upc: { type: Number, required: true },
  ingredients: { type: String, required: true },
  not_a_significant_source_of: { type: String },
  serving_size: { type: Number, required: true },
  serving_size_unit: { type: String, required: true },
  household_serving_fulltext: { type: String },
  branded_food_category: { type: String, required: true },
  data_source: { type: String, required: true },
  package_weight: { type: String },
  modified_date: { type: Date, required: true },
  available_date: { type: Date, required: true },
  market_country: { type: String, required: true },
  discontinued_date: { type: Date },
  preparation_state_code: { type: String },
  trade_channel: { type: String },
  short_description: { type: String },
});
