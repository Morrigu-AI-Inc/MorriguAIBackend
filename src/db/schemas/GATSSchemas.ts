import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class BaseGATSData extends Document {
  @Prop({ required: true })
  statisticalYearMonth: string;

  @Prop({ required: true })
  productType: string;

  @Prop({ required: true })
  reporterCode: string;

  @Prop({ required: true })
  releaseTimeStamp: Date;
}

@Schema()
export class CensusDataReleaseExports extends BaseGATSData {}

@Schema()
export class CensusDataReleaseImports extends BaseGATSData {}

@Schema()
export class UNTradeDataReleaseExports extends BaseGATSData {}

@Schema()
export class UNTradeDataReleaseImports extends BaseGATSData {}

@Schema()
export class GATSRegion extends Document {
  @Prop({ required: true })
  regionCode: string;

  @Prop({ required: true })
  regionName: string;
}

@Schema()
export class GATSCountry extends Document {
  @Prop({ required: true })
  countryCode: string;

  @Prop({ required: true })
  regionCode: string;

  @Prop({ required: true })
  countryName: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  isO3Code: string;

  @Prop({ required: true })
  discontinuedOn: Date;

  @Prop({ required: true })
  gencCode: string;
}

@Schema()
export class GATSCommodity extends Document {
  @Prop({ required: true })
  hS10Code: string;

  @Prop({ required: true })
  startDate: string;

  @Prop({ required: true })
  endDate: string;

  @Prop({ required: true })
  productType: string;

  @Prop({ required: true })
  commodityName: string;

  @Prop({ required: true })
  commodityDescription: string;

  @Prop({ required: true })
  isAgCommodity: boolean;

  @Prop({ required: true })
  censusUOMId1: number;

  @Prop({ required: true })
  censusUOMId2: number;

  @Prop({ required: true })
  fasConvertedUOMId: number;

  @Prop({ required: true })
  fasNonConvertedUOMId: number;
}

@Schema()
export class HS6Commodity extends Document {
  @Prop({ required: true })
  hS6Code: string;

  @Prop({ required: true })
  commodityName: string;

  @Prop({ required: true })
  commodityDescription: string;

  @Prop({ required: true })
  censusUOMId1: number;

  @Prop({ required: true })
  censusUOMId2: number;

  @Prop({ required: true })
  fasConvertedUOMId: number;

  @Prop({ required: true })
  fasNonConvertedUOMId: number;
}

@Schema()
export class GATSUnitOfMeasure extends Document {
  @Prop({ required: true })
  unitOfMeasureId: number;

  @Prop({ required: true })
  unitOfMeasureCode: string;

  @Prop({ required: true })
  unitOfMeasureName: string;

  @Prop({ required: true })
  unitOfMeasureDescription: string;
}

@Schema()
export class GATSCustomsDistrict extends Document {
  @Prop({ required: true })
  customsDistrictId: number;

  @Prop({ required: true })
  customsDistrictName: string;

  @Prop({ required: true })
  customsDistrictRegionCode: string;

  @Prop({ required: true })
  customsDistrictRegionName: string;
}

class GATSBaseImportExport extends Document {}

@Schema()
export class GATSCensusImports extends Document {
  @Prop({ required: false })
  consumptionQuantity1: number;

  @Prop({ required: false })
  consumptionQuantity2: number;

  @Prop({ required: false })
  consumptionValue: number;

  @Prop({ required: false })
  consumptionCIFValue: number;

  @Prop({ required: false })
  cifValue: number;

  @Prop({ required: false })
  date: string;

  @Prop({ required: false })
  countryCode: string;

  @Prop({ required: false })
  hS10Code: string;

  @Prop({ required: false })
  censusUOMId1: number;

  @Prop({ required: false })
  censusUOMId2: number;

  @Prop({ required: false })
  fasConvertedUOMId: number;

  @Prop({ required: false })
  fasNonConvertedUOMId: number;

  @Prop({ required: false })
  quantity1: number;

  @Prop({ required: false })
  quantity2: number;

  @Prop({ required: false })
  value: number;
}

@Schema()
export class GATSCensusReExports extends Document {
  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  countryCode: string;

  @Prop({ required: true })
  hS10Code: string;

  @Prop({ required: true })
  censusUOMId1: number;

  @Prop({ required: true })
  censusUOMId2: number;

  @Prop({ required: true })
  fasConvertedUOMId: number;

  @Prop({ required: true })
  fasNonConvertedUOMId: number;

  @Prop({ required: true })
  quantity1: number;

  @Prop({ required: true })
  quantity2: number;

  @Prop({ required: true })
  value: number;
}

@Schema()
export class GATSCustomDistrictExport extends Document {
  @Prop({ required: true })
  customsDistrictId: number;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  countryCode: string;

  @Prop({ required: true })
  hS10Code: string;

  @Prop({ required: true })
  censusUOMId1: number;

  @Prop({ required: true })
  censusUOMId2: number;

  @Prop({ required: true })
  fasConvertedUOMId: number;

  @Prop({ required: true })
  fasNonConvertedUOMId: number;

  @Prop({ required: true })
  quantity1: number;

  @Prop({ required: true })
  quantity2: number;

  @Prop({ required: true })
  value: number;
}

@Schema()
export class GATSCustomDistrictImport extends Document {
  @Prop({ required: true })
  customsDistrictId: number;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  countryCode: string;

  @Prop({ required: true })
  hS10Code: string;

  @Prop({ required: true })
  censusUOMId1: number;

  @Prop({ required: true })
  censusUOMId2: number;

  @Prop({ required: true })
  fasConvertedUOMId: number;

  @Prop({ required: true })
  fasNonConvertedUOMId: number;

  @Prop({ required: true })
  quantity1: number;

  @Prop({ required: true })
  quantity2: number;

  @Prop({ required: true })
  value: number;
}

@Schema()
export class GATSCustomDistrictReExport extends Document {
  @Prop({ required: true })
  customsDistrictId: number;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  countryCode: string;

  @Prop({ required: true })
  hS10Code: string;

  @Prop({ required: true })
  censusUOMId1: number;

  @Prop({ required: true })
  censusUOMId2: number;

  @Prop({ required: true })
  fasConvertedUOMId: number;

  @Prop({ required: true })
  fasNonConvertedUOMId: number;

  @Prop({ required: true })
  quantity1: number;

  @Prop({ required: true })
  quantity2: number;

  @Prop({ required: true })
  value: number;
}

@Schema()
export class GATSUNTradeImport extends Document {
  @Prop({ required: true })
  year: string;

  @Prop({ required: true })
  reporterCountryCode: string;

  @Prop({ required: true })
  partnerCountryCode: string;

  @Prop({ required: true })
  hS6Code: string;

  @Prop({ required: true })
  censusUOMId1: number;

  @Prop({ required: true })
  censusUOMId2: number;

  @Prop({ required: true })
  fasConvertedUOMId: number;

  @Prop({ required: true })
  fasNonConvertedUOMId: number;

  @Prop({ required: true })
  quantity1: number;

  @Prop({ required: true })
  quantity2: number;

  @Prop({ required: true })
  value: number;
}

@Schema()
export class GATSUNTradeExport extends Document {
  @Prop({ required: true })
  year: string;

  @Prop({ required: true })
  reporterCountryCode: string;

  @Prop({ required: true })
  partnerCountryCode: string;

  @Prop({ required: true })
  hS6Code: string;

  @Prop({ required: true })
  censusUOMId1: number;

  @Prop({ required: true })
  censusUOMId2: number;

  @Prop({ required: true })
  fasConvertedUOMId: number;

  @Prop({ required: true })
  fasNonConvertedUOMId: number;

  @Prop({ required: true })
  quantity1: number;

  @Prop({ required: true })
  quantity2: number;

  @Prop({ required: true })
  value: number;
}

@Schema()
export class GATSUNTradeReExport extends Document {
  @Prop({ required: true })
  year: string;

  @Prop({ required: true })
  reporterCountryCode: string;

  @Prop({ required: true })
  partnerCountryCode: string;

  @Prop({ required: true })
  hS6Code: string;

  @Prop({ required: true })
  censusUOMId1: number;

  @Prop({ required: true })
  censusUOMId2: number;

  @Prop({ required: true })
  fasConvertedUOMId: number;

  @Prop({ required: true })
  fasNonConvertedUOMId: number;

  @Prop({ required: true })
  quantity1: number;

  @Prop({ required: true })
  quantity2: number;

  @Prop({ required: true })
  value: number;
}

@Schema()
export class PSDCommodity extends Document {
  @Prop({ required: true })
  commodityCode: string;

  @Prop({ required: true })
  commodityName: string;
}

@Schema()
export class PSDDataRelease extends Document {
  @Prop({ required: true })
  commodityCode: string;

  @Prop({ required: true })
  countryCode: string;

  @Prop({ required: true })
  marketYear: string;

  @Prop({ required: true })
  releaseYear: string;

  @Prop({ required: true })
  releaseMonth: string;
}

@Schema()
export class PSDRecord extends Document {
  @Prop({ required: true })
  commodityCode: string;

  @Prop({ required: true })
  countryCode: string;

  @Prop({ required: true })
  marketYear: string;

  @Prop({ required: true })
  calendarYear: string;

  @Prop({ required: true })
  month: string;

  @Prop({ required: true })
  attributeId: number;

  @Prop({ required: true })
  unitId: number;

  @Prop({ required: true })
  value: number;
}

@Schema()
export class PSDRegion extends Document {
  @Prop({ required: true })
  regionCode: string;

  @Prop({ required: true })
  regionName: string;
}

@Schema()
export class PSDCountry extends Document {
  @Prop({ required: true })
  countryCode: string;

  @Prop({ required: true })
  countryName: string;

  @Prop({ required: true })
  regionCode: string;

  @Prop({ required: true })
  gencCode: string;
}

@Schema()
export class PSDUnitOfMeasure extends Document {
  @Prop({ required: true })
  unitId: number;

  @Prop({ required: true })
  unitDescription: string;
}

@Schema()
export class PSDAttribute extends Document {
  @Prop({ required: true })
  attributeId: number;

  @Prop({ required: true })
  attributeName: string;
}

export const schemas = {
  CensusDataReleaseExports: SchemaFactory.createForClass(
    CensusDataReleaseExports,
  ),
  CensusDataReleaseImports: SchemaFactory.createForClass(
    CensusDataReleaseImports,
  ),
  GATSRegion: SchemaFactory.createForClass(GATSRegion),
  GATSCountry: SchemaFactory.createForClass(GATSCountry),
  GATSCommodity: SchemaFactory.createForClass(GATSCommodity),
  HS6Commodity: SchemaFactory.createForClass(HS6Commodity),
  GATSUnitOfMeasure: SchemaFactory.createForClass(GATSUnitOfMeasure),
  GATSCustomsDistrict: SchemaFactory.createForClass(GATSCustomsDistrict),
  GATSCensusImports: SchemaFactory.createForClass(GATSCensusImports),
  GATSCensusReExports: SchemaFactory.createForClass(GATSCensusReExports),
  GATSCustomDistrictExport: SchemaFactory.createForClass(
    GATSCustomDistrictExport,
  ),
  GATSCustomDistrictImport: SchemaFactory.createForClass(
    GATSCustomDistrictImport,
  ),
  GATSCustomDistrictReExport: SchemaFactory.createForClass(
    GATSCustomDistrictReExport,
  ),
  GATSUNTradeImport: SchemaFactory.createForClass(GATSUNTradeImport),
  GATSUNTradeExport: SchemaFactory.createForClass(GATSUNTradeExport),
  GATSUNTradeReExport: SchemaFactory.createForClass(GATSUNTradeReExport),
  PSDCommodity: SchemaFactory.createForClass(PSDCommodity),
  PSDDataRelease: SchemaFactory.createForClass(PSDDataRelease),
  PSDRecord: SchemaFactory.createForClass(PSDRecord),
  PSDRegion: SchemaFactory.createForClass(PSDRegion),
  PSDCountry: SchemaFactory.createForClass(PSDCountry),
  PSDUnitOfMeasure: SchemaFactory.createForClass(PSDUnitOfMeasure),
  PSDAttribute: SchemaFactory.createForClass(PSDAttribute),
};
