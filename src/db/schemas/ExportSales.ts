import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Region extends Document {
  @Prop({ required: true })
  regionId: number;

  @Prop({ required: true })
  regionName: string;
}

@Schema()
export class Country extends Document {
  @Prop({ required: true })
  countryCode: number;

  @Prop({ required: true })
  countryName: string;

  @Prop({ required: true })
  countryDescription: string;

  @Prop({ required: true })
  regionId: number;

  @Prop({ required: true })
  gencCode: string;
}

@Schema()
export class Commodity extends Document {
  @Prop({ required: true })
  commodityCode: number;

  @Prop({ required: true })
  commodityName: string;

  @Prop({ required: true })
  unitId: number;
}

@Schema()
export class UnitOfMeasure extends Document {
  @Prop({ required: true })
  unitId: number;

  @Prop({ required: true })
  unitNames: string;
}

@Schema()
export class DataReleaseDates extends Document {
  @Prop({ required: true })
  commodityCode: number;

  @Prop({ required: true })
  marketYearStart: Date;

  @Prop({ required: true })
  marketYearEnd: Date;

  @Prop({ required: true })
  marketYear: number;

  @Prop({ required: true })
  releaseTimeStamp: Date;
}

@Schema()
export class ExportSales extends Document {
  @Prop({ required: true })
  commodityCode: number;

  @Prop({ required: true })
  countryCode: number;

  @Prop({ required: true })
  weeklyExports: number;

  @Prop({ required: true })
  accumulatedExports: number;

  @Prop({ required: true })
  outstandingSales: number;

  @Prop({ required: true })
  grossNewSales: number;

  @Prop({ required: true })
  currentMYNetSales: number;

  @Prop({ required: true })
  currentMYTotalCommitment: number;

  @Prop({ required: true })
  nextMYOutstandingSales: number;

  @Prop({ required: true })
  nextMYNetSales: number;

  @Prop({ required: true })
  unitId: number;

  @Prop({ required: true })
  weekEndingDate: Date;
}

export const RegionSchema = SchemaFactory.createForClass(Region);
export const CountrySchema = SchemaFactory.createForClass(Country);
export const CommoditySchema = SchemaFactory.createForClass(Commodity);
export const UnitOfMeasureSchema = SchemaFactory.createForClass(UnitOfMeasure);
export const DataReleaseDatesSchema = SchemaFactory.createForClass(DataReleaseDates);
export const ExportSalesSchema = SchemaFactory.createForClass(ExportSales);
