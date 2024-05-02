// src/revenue-forecast/schemas/revenue-forecast.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class RevenueData extends Document {
  @Prop({ required: true })
  period: string; // "2024-01" for monthly or "2024" for yearly forecasts

  // New Customers
  @Prop({ required: true, default: 0 })
  newCustomersMonthly: number;

  @Prop({ required: true, default: 0 })
  newCustomersAnnual: number;

  @Prop({ required: true, default: 0 })
  arpcNewCustomers: number; // Average Revenue Per Customer

  @Prop({ required: true, default: 0 })
  mrrNewCustomersMonthly: number; // Monthly Recurring Revenue from new customers

  @Prop({ required: true, default: 0 })
  mrrNewCustomersAnnual: number;

  // Expansion
  @Prop({ required: true, default: 0 })
  expansionsMonthly: number;

  @Prop({ required: true, default: 0 })
  expansionsAnnual: number;

  @Prop({ default: 0 })
  expansionPercentMonthly: number;

  @Prop({ default: 0 })
  expansionPercentAnnual: number;

  @Prop({ default: 0 })
  arpcExpansion: number;

  @Prop({ default: 0 })
  mrrExpansionMonthly: number;

  @Prop({ default: 0 })
  mrrExpansionAnnual: number;

  // Reactivation
  @Prop({ default: 0 })
  reactivationsMonthly: number;

  @Prop({ default: 0 })
  arpcReactivation: number;

  @Prop({ default: 0 })
  reactivationRevenueMonthly: number;

  // Churn
  @Prop({ default: 0 })
  churnedCustomersMonthly: number;

  @Prop({ default: 0 })
  churnPercentMonthly: number;

  @Prop({ default: 0 })
  arpcChurned: number;

  @Prop({ default: 0 })
  mrrChurnedMonthly: number;

  @Prop({ default: 0 })
  customersUpForRenewalAnnual: number;

  @Prop({ default: 0 })
  renewalChurnPercentAnnual: number;

  @Prop({ default: 0 })
  churnedCustomersAnnual: number;

  @Prop({ default: 0 })
  customerChurnPercentAnnual: number;

  @Prop({ default: 0 })
  mrrChurnedAnnual: number;

  // Contraction
  @Prop({ default: 0 })
  downgradesMonthly: number;

  @Prop({ default: 0 })
  contractionPercentMonthly: number;

  @Prop({ default: 0 })
  contractedMrrMonthly: number;

  @Prop({ default: 0 })
  downgradesAnnual: number;

  @Prop({ default: 0 })
  contractionPercentAnnual: number;

  @Prop({ default: 0 })
  contractedMrrAnnual: number;

  // Net Totals
  @Prop({ default: 0 })
  netNewCustomers: number;

  @Prop({ default: 0 })
  totalCustomers: number;

  @Prop({ default: 0 })
  netNewMrr: number; // Net New Monthly Recurring Revenue

  @Prop({ default: 0 })
  totalMrr: number; // Total Monthly Recurring Revenue

  @Prop({ default: Date.now })
  createdAt: Date; // Timestamp when the forecast was created

  @Prop()
  updatedAt: Date; // Timestamp when the forecast was last updated
}

export const RevenueDataSchema = SchemaFactory.createForClass(RevenueData);
