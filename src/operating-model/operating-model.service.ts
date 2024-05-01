// src/financial-plan/operating-model.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FinancialCategory } from 'src/db/schemas/FinancialCategory';
import {
  OperatingModel,
  OperatingModelDocument,
} from 'src/db/schemas/OperatingModel';

@Injectable()
export class OperatingModelService {
  public readonly defaultGrowth = 0.05;
  constructor(
    @InjectModel(OperatingModel.name)
    private operatingModelModel: Model<OperatingModel>,
  ) {}

  async initializeOperatingModel(): Promise<OperatingModel> {
    const defaultData = {
      name: 'Default Operating Model',
      scenario: 'Base-Case',
      income: [
        {
          name: 'Sales',
          description: 'Initial Subscription Fees',
          monthlyDetails: [{ month: new Date(), amount: 10000 }],
        },
      ],
      expenses: [
        {
          name: 'Rent',
          description: 'Initial Office Rent',
          monthlyDetails: [{ month: new Date(), amount: 2000 }],
        },
      ],
      otherFinancials: [
        {
          name: 'Miscellaneous',
          description: 'Initial Miscellaneous',
          monthlyDetails: [{ month: new Date(), amount: 500 }],
        },
      ],
    };

    const newModel = new this.operatingModelModel(defaultData);
    return newModel.save();
  }

  async createOperatingModel(data: any): Promise<OperatingModelDocument> {
    const newModel = new this.operatingModelModel(data);
    return newModel.save();
  }

  async getOperatingModel(id: string): Promise<OperatingModelDocument> {
    const model = await this.operatingModelModel.findById(id);
    if (!model) {
      throw new NotFoundException('Operating model not found');
    }
    return model;
  }

  async updateOperatingModel(
    id: string,
    updateData: any,
  ): Promise<OperatingModelDocument> {
    const updatedModel = await this.operatingModelModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );
    if (!updatedModel) {
      throw new NotFoundException('Operating model not found');
    }
    return updatedModel;
  }

  async deleteOperatingModel(id: string): Promise<void> {
    const result = await this.operatingModelModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Operating model not found');
    }
  }

  // Forecasting methods similar to those in the HiringPlanService
  async calculateForecasts(
    scenarioId: string,
    monthsAhead: number,
    growthRate: number = this.defaultGrowth,
  ): Promise<any[]> {
    const forecasts = [];
    let startModel = await this.getOperatingModel(scenarioId);

    for (let i = 0; i < monthsAhead; i++) {
      const forecastModel = this.applyGrowthRateToModel(startModel, growthRate);
      forecasts.push(forecastModel);
      // Prepare model for the next month forecast
      startModel = forecastModel;
    }
    return forecasts;
  }

  private applyGrowthRateToModel(
    model: OperatingModelDocument,
    growthRate: number = this.defaultGrowth,
  ): OperatingModelDocument {
    const forecastModel = new this.operatingModelModel(model.toObject()); // Clone the current model for forecasting
    forecastModel.income.forEach((category) =>
      this.applyCategoryGrowth(category, growthRate),
    );
    forecastModel.expenses.forEach((category) =>
      this.applyCategoryGrowth(category, growthRate),
    );
    forecastModel.otherFinancials.forEach((category) =>
      this.applyCategoryGrowth(category, growthRate),
    );
    return forecastModel;
  }

  private applyCategoryGrowth(category: FinancialCategory, growthRate: number) {
    category.monthlyDetails.forEach((detail) => {
      detail.amount += detail.amount * growthRate;
    });
  }
}
