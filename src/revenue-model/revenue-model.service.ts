// src/revenue-model/revenue-model.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RevenueData } from 'src/db/schemas/RevenueData';
import { RevenueModel } from 'src/db/schemas/RevenueModel';

@Injectable()
export class RevenueModelService {
  constructor(
    @InjectModel(RevenueModel.name) private revenueModel: Model<RevenueModel>,
  ) {}

  async initRevenueModel(): Promise<RevenueModel> {
    const defaultData: RevenueData[] = [
      {
        date: new Date(), // Example: setting today's date as initial date
        newCustomers: 0,
        conversionRate: 0.0,
        recurringRevenue: 0,
        // Initialize other necessary fields with default values
      },
    ];

    const newRevenueModel = new this.revenueModel({
      scenario: 'base-case', // Default to a base-case scenario
      data: defaultData,
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
        (d) => d.date < startOfMonth,
      );
      if (lastMonthData) {
        // Calculate the forecast based on last month's data and growth/churn rates
        const forecastedRevenue =
          lastMonthData.recurringRevenue *
          (1 + lastMonthData.salesGrowth / 100);
        const forecastedCustomers = Math.round(
          lastMonthData.newCustomers * (1 - lastMonthData.churnRate / 100),
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
}
