// src/revenue-model/revenue-model.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RevenueData } from 'src/db/schemas/RevenueData';
import { RevenueModel } from 'src/db/schemas/RevenueModel';
import * as ARIMA from 'arima'; // Import the ARIMA library

@Injectable()
export class RevenueModelService {
  constructor(
    @InjectModel(RevenueModel.name) private revenueModel: Model<RevenueModel>,
  ) {}

  async initRevenueModel(): Promise<RevenueModel> {
    const defaultData: Partial<RevenueData>[] = [
      {
        period: '2024-01',
        newCustomersMonthly: 100,
        newCustomersAnnual: 1200,
        arpcNewCustomers: 100,
        mrrNewCustomersMonthly: 10000,
        mrrNewCustomersAnnual: 120000,
        expansionsMonthly: 10,
        expansionsAnnual: 120,
        expansionPercentMonthly: 10,
        expansionPercentAnnual: 10,
        arpcExpansion: 100,
        mrrExpansionMonthly: 1000,
        mrrExpansionAnnual: 12000,
        reactivationsMonthly: 5,
        arpcReactivation: 100,
        reactivationRevenueMonthly: 500,
        churnedCustomersMonthly: 5,
        churnPercentMonthly: 5,
        arpcChurned: 100,
        mrrChurnedMonthly: 500,
        customersUpForRenewalAnnual: 100,
        renewalChurnPercentAnnual: 10,
        churnedCustomersAnnual: 10,
        customerChurnPercentAnnual: 10,
        mrrChurnedAnnual: 1000,
        downgradesMonthly: 5,
        contractionPercentMonthly: 5,
        contractedMrrMonthly: 500,
        downgradesAnnual: 10,
        contractionPercentAnnual: 10,
        contractedMrrAnnual: 1000,
        netNewCustomers: 100,
        totalCustomers: 1000,
        netNewMrr: 1000,
        totalMrr: 10000,
      },
      {
        period: '2024-02',
        newCustomersMonthly: 110,
        newCustomersAnnual: 1320,
        arpcNewCustomers: 100,
        mrrNewCustomersMonthly: 11000,
        mrrNewCustomersAnnual: 132000,
        expansionsMonthly: 11,
        expansionsAnnual: 132,
        expansionPercentMonthly: 10,
        expansionPercentAnnual: 10,
        arpcExpansion: 100,
        mrrExpansionMonthly: 1100,
        mrrExpansionAnnual: 13200,
        reactivationsMonthly: 6,
        arpcReactivation: 100,
        reactivationRevenueMonthly: 600,
        churnedCustomersMonthly: 6,
        churnPercentMonthly: 5,
        arpcChurned: 100,
        mrrChurnedMonthly: 600,
        customersUpForRenewalAnnual: 110,
        renewalChurnPercentAnnual: 10,
        churnedCustomersAnnual: 11,
        customerChurnPercentAnnual: 10,
        mrrChurnedAnnual: 1100,
        downgradesMonthly: 6,
        contractionPercentMonthly: 5,
        contractedMrrMonthly: 600,
        downgradesAnnual: 11,
        contractionPercentAnnual: 10,
        contractedMrrAnnual: 1100,
        netNewCustomers: 110,
        totalCustomers: 1100,
        netNewMrr: 1100,
        totalMrr: 11000,
      },
      {
        period: '2024-03',
        newCustomersMonthly: 120,
        newCustomersAnnual: 1440,
        arpcNewCustomers: 100,
        mrrNewCustomersMonthly: 12000,
        mrrNewCustomersAnnual: 144000,
        expansionsMonthly: 12,
        expansionsAnnual: 144,
        expansionPercentMonthly: 10,
        expansionPercentAnnual: 10,
        arpcExpansion: 100,
        mrrExpansionMonthly: 1200,
        mrrExpansionAnnual: 14400,
        reactivationsMonthly: 7,
        arpcReactivation: 100,
        reactivationRevenueMonthly: 700,
        churnedCustomersMonthly: 7,
        churnPercentMonthly: 5,
        arpcChurned: 100,
        mrrChurnedMonthly: 700,
        customersUpForRenewalAnnual: 120,
        renewalChurnPercentAnnual: 10,
        churnedCustomersAnnual: 12,
        customerChurnPercentAnnual: 10,
        mrrChurnedAnnual: 1200,
        downgradesMonthly: 7,
        contractionPercentMonthly: 5,
        contractedMrrMonthly: 700,
        downgradesAnnual: 12,
        contractionPercentAnnual: 10,
        contractedMrrAnnual: 1200,
        netNewCustomers: 120,
        totalCustomers: 1200,
        netNewMrr: 1200,
        totalMrr: 12000,
      },
    ];

    const newRevenueModel = new this.revenueModel({
      scenario: 'base-case', // Default to a base-case scenario
      data: [defaultData],
    });

    return newRevenueModel.save();
  }

  // Create a new revenue model
  async createRevenueModel(data: any): Promise<RevenueModel> {
    const newRevenueModel = new this.revenueModel(data);
    return newRevenueModel.save();
  }

  // Update an existing revenue model
  async updateRevenueModel(
    modelId: string,
    updateData: any,
  ): Promise<RevenueModel> {
    const updatedModel = await this.revenueModel.findByIdAndUpdate(
      modelId,
      updateData,
      { new: true },
    );
    if (!updatedModel) {
      throw new NotFoundException('Revenue model not found');
    }
    return updatedModel;
  }

  async deleteRevenueModel(modelId: string): Promise<void> {
    return await this.revenueModel.findByIdAndDelete(modelId);
  }

  // Get a revenue model by ID
  async getRevenueModel(modelId: string): Promise<RevenueModel> {
    const model = await this.revenueModel.findById(modelId);
    if (!model) {
      throw new NotFoundException('Revenue model not found');
    }
    return model;
  }

  // Calculate financial forecasts based on revenue data
  async calculateForecasts(
    scenario: string,
    startMonth: Date,
    monthsAhead: number,
  ): Promise<any[]> {
    const forecasts = [];
    for (let i = 0; i < monthsAhead; i++) {
      const forecastDate = new Date(
        startMonth.getFullYear(),
        startMonth.getMonth() + i,
        1,
      );
      const monthlyForecast = await this.calculateMonthlyForecast(
        scenario,
        forecastDate,
      );
      forecasts.push(monthlyForecast);
    }
    return forecasts;
  }

  private async calculateMonthlyForecast(
    scenario: string,
    date: Date,
  ): Promise<any> {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const dataForMonth = await this.revenueModel
      .findOne({
        scenario: scenario,
        'data.date': { $gte: startOfMonth, $lt: endOfMonth },
      })
      .exec();

    if (dataForMonth && dataForMonth.data.length > 0) {
      const lastMonthData = dataForMonth.data.find(
        (d) => new Date(d.period) < startOfMonth,
      );
      if (lastMonthData) {
        // Calculate the forecast based on last month's data and growth/churn rates
        const forecastedRevenue =
          lastMonthData.totalMrr *
          (1 + lastMonthData.expansionPercentMonthly / 100);

        const forecastedCustomers = Math.round(
          lastMonthData.newCustomersMonthly *
            (1 - lastMonthData.churnPercentMonthly / 100),
        );

        return {
          date: startOfMonth,
          forecastedRevenue,
          forecastedCustomers,
          originalData: lastMonthData,
        };
      }
    }

    // If there is no previous month data, or it's the first entry
    return {
      date: startOfMonth,
      error: 'No sufficient data available for forecasting',
    };
  }

  async forecastRevenue(
    scenario: string,
    monthsAhead: number,
    metric: string,
  ): Promise<number[]> {
    const revenueData = await this.revenueModel.findOne({ scenario: scenario });
    if (!revenueData) {
      throw new Error('Scenario data not found');
    }
    const data = revenueData.data
      .sort((a, b) => a.period.localeCompare(b.period))
      .map((d) => d[metric]);
    const arimaModel = new ARIMA({
      seasonal: false, // Or true, based on your data's characteristics
      p: 6,
      d: 1,
      q: 6, // ARIMA model parameters
      verbose: false,
    }).fit(data);

    const [predictedValues, predictedErrors] = arimaModel.predict(monthsAhead);

    return [...data.slice(-12), ...predictedValues];
  }
}
