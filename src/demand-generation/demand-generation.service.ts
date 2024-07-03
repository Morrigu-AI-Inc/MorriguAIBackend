// src/demand-generation/demand-generation.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lead } from 'src/db/schemas/Lead';
import { Customer } from 'src/db/schemas/Customer';

@Injectable()
export class DemandGenerationService {
  constructor(
    @InjectModel(Lead.name) private leadModel: Model<Lead>,
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) {}

  // Initialize sample data for testing
  async initializeData(): Promise<void> {
    // Define sample data
    const sampleLeads = [
      {
        source: 'Online Campaign',
        dateGenerated: new Date('2024-01-01'),
        isConverted: false,
      },
      {
        source: 'Email Marketing',
        dateGenerated: new Date('2024-01-05'),
        isConverted: false,
      },
      {
        source: 'Social Media',
        dateGenerated: new Date('2024-01-10'),
        isConverted: true,
      },
      {
        source: 'Referral',
        dateGenerated: new Date('2024-01-15'),
        isConverted: true,
      },
    ];

    // Create leads
    const leads = await Promise.all(
      sampleLeads.map((data) => new this.leadModel(data).save()),
    );

    // Define sample customers based on some of the leads
    const sampleCustomers = [
      {
        leadId: leads[2]._id,
        conversionDate: new Date('2024-01-12'),
        lifetimeValue: 1200,
      },
      {
        leadId: leads[3]._id,
        conversionDate: new Date('2024-01-18'),
        lifetimeValue: 1500,
      },
    ];

    // Create customers
    await Promise.all(
      sampleCustomers.map((data) => new this.customerModel(data).save()),
    );

    console.log('Data initialized successfully.');
  }

  // Calculate demand generation for a specific period
  async calculateDemandGeneration(start: Date, end: Date): Promise<any> {
    const leads = await this.leadModel.find({
      dateGenerated: { $gte: start, $lte: end },
    });

    const customers = await this.customerModel.find({
      conversionDate: { $gte: start, $lte: end },
    });

    const totalLeads = leads.length;
    const totalConversions = customers.length;
    const conversionRate =
      totalLeads > 0 ? (totalConversions / totalLeads) * 100 : 0;
    const totalDemandValue = customers.reduce(
      (acc, cur) => acc + cur.lifetimeValue,
      0,
    );

    return {
      periodStart: start,
      periodEnd: end,
      totalLeads,
      totalConversions,
      conversionRate,
      totalDemandValue,
    };
  }

  // Utility to create a lead (could be triggered by various marketing activities)
  async createLead(data: any): Promise<Lead> {
    const newLead = new this.leadModel(data);
    return newLead.save();
  }

  // Utility to convert a lead to a customer
  async convertLeadToCustomer(
    leadId: string,
    lifetimeValue: number,
  ): Promise<Customer> {
    const lead = await this.leadModel.findById(leadId);
    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    const newCustomer = new this.customerModel({
      leadId: lead._id,
      conversionDate: new Date(),
      lifetimeValue: lifetimeValue,
    });

    await lead.updateOne({ isConverted: true });
    return newCustomer.save();
  }

  // Retrieve all leads for auditing or further analysis
  async getAllLeads(): Promise<Lead[]> {
    return this.leadModel.find();
  }

  // Retrieve all customers for auditing or further analysis
  async getAllCustomers(): Promise<Customer[]> {
    return this.customerModel.find();
  }

  async forecastDemandGeneration(
    startForecastDate: Date,
    monthsAhead: number,
  ): Promise<any> {
    const historicalData = await this.calculateHistoricalData(
      startForecastDate,
      monthsAhead,
    );

    const forecastedDemand = [];
    for (let month = 0; month < monthsAhead; month++) {
      const monthStart = new Date(
        startForecastDate.getFullYear(),
        startForecastDate.getMonth() + month,
        1,
      );
      const monthEnd = new Date(
        monthStart.getFullYear(),
        monthStart.getMonth() + 1,
        0,
      );

      const forecastedValue = this.calculateMonthlyForecast(
        historicalData.averageConversionRate,
        historicalData.averageLifetimeValue,
        historicalData.expectedLeadsPerMonth,
        monthStart,
        monthEnd,
      );

      forecastedDemand.push({
        period: `${monthStart.toLocaleString('default', { month: 'long' })} ${monthStart.getFullYear()}`,
        forecastedValue,
      });
    }

    return forecastedDemand;
  }

  private async calculateHistoricalData(
    startHistoricalDate: Date,
    monthsToAnalyze: number,
  ): Promise<any> {
    const endHistoricalDate = new Date(
      startHistoricalDate.getFullYear(),
      startHistoricalDate.getMonth() - monthsToAnalyze,
      0,
    );

    const leads = await this.leadModel.find({
      dateGenerated: { $gte: endHistoricalDate, $lt: startHistoricalDate },
    });

    const customers = await this.customerModel.find({
      conversionDate: { $gte: endHistoricalDate, $lt: startHistoricalDate },
    });

    const totalLeads = leads.length;
    const totalConversions = customers.length;
    const totalLifetimeValue = customers.reduce(
      (acc, cur) => acc + cur.lifetimeValue,
      0,
    );

    const averageConversionRate =
      totalLeads > 0 ? (totalConversions / totalLeads) * 100 : 0;
    const averageLifetimeValue =
      totalConversions > 0 ? totalLifetimeValue / totalConversions : 0;
    const expectedLeadsPerMonth = totalLeads / monthsToAnalyze;

    return {
      averageConversionRate,
      averageLifetimeValue,
      expectedLeadsPerMonth,
    };
  }

  private calculateMonthlyForecast(
    averageConversionRate: number,
    averageLifetimeValue: number,
    expectedLeadsPerMonth: number,
    monthStart: Date,
    monthEnd: Date,
  ): number {
    const expectedConversions =
      (expectedLeadsPerMonth * averageConversionRate) / 100;
    const forecastedValue = expectedConversions * averageLifetimeValue;

    return forecastedValue;
  }
}
