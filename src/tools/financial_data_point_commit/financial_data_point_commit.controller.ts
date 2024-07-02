import { Controller, Get, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DatumEntry } from 'src/db/schemas/DatumEntry';

@Controller('tools/financial_data_point_commit')
export class FinancialDataPointCommitController {
  constructor(
    @InjectModel('DatumEntry')
    private readonly datumEntryModel: Model<DatumEntry>,
  ) {}

  @Get()
  async getFinancialDataPointCommit(
    @Query('payload') payload: string,
  ): Promise<any> {
    
    const data = JSON.parse(JSON.parse(payload));

    

    this.datumEntryModel.create({
      date: data.datum.Date,
      period: data.datum.Date,
      company: data.company,
      ticker: data.ticker,
      source: data.summary,
      datum: data,
    });

    return { message: 'getFinancialDataPointCommit', payload: payload };
  }
}
