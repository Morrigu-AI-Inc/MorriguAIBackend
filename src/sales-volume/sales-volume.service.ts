// src/sales-forecast/sales-forecast.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SalesVolume } from 'src/db/schemas/SalesVolumn';

@Injectable()
export class SalesVolumeService {
  constructor(
    @InjectModel(SalesVolume.name) private salesVolumeModel: Model<SalesVolume>,
  ) {}

  async initializeData(): Promise<void> {
    // Sample sales volumes over the last 12 months
    const sampleData = [
      { period: '2024-01', projectedVolume: 100, revenueProjection: 10000 },
      { period: '2024-02', projectedVolume: 120, revenueProjection: 12000 },
      { period: '2024-03', projectedVolume: 150, revenueProjection: 15000 },
      { period: '2024-04', projectedVolume: 130, revenueProjection: 13000 },
      { period: '2024-05', projectedVolume: 160, revenueProjection: 16000 },
      { period: '2024-06', projectedVolume: 180, revenueProjection: 18000 },
      { period: '2024-07', projectedVolume: 170, revenueProjection: 17000 },
      { period: '2024-08', projectedVolume: 200, revenueProjection: 20000 },
      { period: '2024-09', projectedVolume: 190, revenueProjection: 19000 },
      { period: '2024-10', projectedVolume: 220, revenueProjection: 22000 },
      { period: '2024-11', projectedVolume: 210, revenueProjection: 21000 },
      { period: '2024-12', projectedVolume: 230, revenueProjection: 23000 },
    ];

    // Clear existing data to prevent duplication
    await this.salesVolumeModel.deleteMany({});

    // Insert sample data
    await this.salesVolumeModel.insertMany(sampleData);
    console.log('Sales forecast data initialized.');
  }

  // Method to create a new forecast
  async createForecast(forecastData: any): Promise<SalesVolume> {
    const newForecast = new this.salesVolumeModel(forecastData);
    return newForecast.save();
  }

  // Method to update an existing forecast
  async updateForecast(
    forecastId: string,
    updateData: any,
  ): Promise<SalesVolume> {
    const updatedForecast = await this.salesVolumeModel.findByIdAndUpdate(
      forecastId,
      updateData,
      { new: true },
    );
    if (!updatedForecast) {
      throw new NotFoundException(`Forecast with ID ${forecastId} not found`);
    }
    return updatedForecast;
  }

  // Method to retrieve a forecast by ID
  async getForecastById(forecastId: string): Promise<SalesVolume> {
    const forecast = await this.salesVolumeModel.findById(forecastId);
    if (!forecast) {
      throw new NotFoundException(`Forecast with ID ${forecastId} not found`);
    }
    return forecast;
  }

  // Method to retrieve all forecasts
  async getAllForecasts(): Promise<SalesVolume[]> {
    return this.salesVolumeModel.find();
  }

  // Method to delete a forecast
  async deleteForecast(forecastId: string): Promise<void> {
    const result = await this.salesVolumeModel.deleteOne({ _id: forecastId });
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Forecast with ID ${forecastId} not found`);
    }
  }

  // Method to forecast future sales volume using Exponential Smoothing
  async forecastSalesVolume(
    startDate: Date,
    monthsAhead: number,
    alpha: number,
  ): Promise<any[]> {
    const salesData = await this.salesVolumeModel
      .find({
        createdAt: { $gte: startDate },
      })
      .sort({ createdAt: 1 })
      .select('projectedVolume createdAt');

    if (salesData.length === 0) {
      throw new Error('No sales data available for forecasting.');
    }

    // Initialize forecast array with actual data points
    const forecasts = salesData.map((s) => ({
      date: s.createdAt,
      projectedVolume: s.projectedVolume,
    }));

    // Start forecasting from the last actual data point
    let lastActual = forecasts[forecasts.length - 1];

    // Generate forecasts for additional periods beyond the existing data
    for (let i = 1; i <= monthsAhead; i++) {
      const newDate = new Date(lastActual.date);
      newDate.setMonth(newDate.getMonth() + 1);

      // Apply exponential smoothing formula
      const newForecast =
        alpha * lastActual.projectedVolume +
        (1 - alpha) * lastActual.projectedVolume;
      forecasts.push({ date: newDate, projectedVolume: newForecast });

      // Update lastActual to the new forecast for next iteration
      lastActual = { date: newDate, projectedVolume: newForecast };
    }

    return forecasts;
  }

  async forecastRevenue(
    startDate: Date,
    monthsAhead: number,
    alpha: number,
    revenuePerUnit: number,
  ): Promise<any[]> {
    const salesForecasts = await this.forecastSalesVolume(
      startDate,
      monthsAhead,
      alpha,
    );
    const revenueForecasts = salesForecasts.map((forecast) => {
      return {
        period: forecast.date,
        projectedVolume: forecast.projectedVolume,
        revenueProjection: forecast.projectedVolume * revenuePerUnit,
      };
    });
    return revenueForecasts;
  }
}
