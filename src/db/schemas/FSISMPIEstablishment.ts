import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FSISMPIEstablishmentDocument = FSISMPIEstablishment & Document;

@Schema()
export class FSISMPIEstablishment {
  @Prop({ required: true })
  establishment_id: number;

  @Prop({ required: true })
  establishment_number: string;

  @Prop({ required: true })
  establishment_name: string;

  @Prop()
  duns_number: string;

  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  zip: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  grant_date: Date;

  @Prop({ required: true })
  activities: string;

  @Prop()
  dbas: string;

  @Prop({ required: true })
  district: number;

  @Prop({ required: true })
  circuit: number;

  @Prop({ required: true })
  size: string;

  @Prop()
  latitude: number;

  @Prop()
  longitude: number;

  @Prop({ required: true })
  county: string;

  @Prop()
  fips_code: number;
}

export const FSISMPIEstablishmentSchema =
  SchemaFactory.createForClass(FSISMPIEstablishment);
