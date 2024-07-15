import { Injectable } from '@nestjs/common';
import { CreateFsiDto } from './dto/create-fsi.dto';
import { UpdateFsiDto } from './dto/update-fsi.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FSISMPIEstablishment } from 'src/db/schemas/FSISMPIEstablishment';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as csvParser from 'csv-parser';
import { Readable } from 'stream';
import axios from 'axios';
import { FSISEstDemographic } from 'src/db/schemas/FSISEstDemographic';
@Injectable()
export class FsisService {
  constructor(
    @InjectModel(FSISMPIEstablishment.name)
    readonly fsisModel: Model<FSISMPIEstablishment>,
    @InjectModel(FSISEstDemographic.name)
    readonly fsisDemoModel: Model<FSISEstDemographic>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async ingest() {
    const link =
      'https://www.fsis.usda.gov/sites/default/files/media_file/documents/MPI_Directory_by_Establishment_Name.csv';
    console.log('Ingesting data from:', link);

    try {
      console.log('Starting fetch request...');

      const response = await fetch(link, {
        headers: {
          Accept: '*/*',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
          Host: 'www.fsis.usda.gov',
          'Accept-Encoding': 'gzip, deflate, br',
        },
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      console.log('Data received');

      const stream = Readable.fromWeb(response.body as any);
      const records = await this.parseCsv(stream);

      console.log('Parsed records:', records.length);
      console.log('Sample data:', records.slice(0, 5)); // Log first 5 records for inspection

      // we need to update if establishment_id is already present
      for (const record of records) {
        await this.fsisModel.updateOne(
          { establishment_id: record.establishment_id },
          record,
          { upsert: true },
        );
      }

      return records;
    } catch (error) {
      console.error('Error occurred during data ingestion:', error.message);
    }
  }

  private parseCsv(stream: Readable): Promise<any[]> {
    const records: any[] = [];
    return new Promise((resolve, reject) => {
      stream
        .pipe(csvParser())
        .on('data', (row) => {
          records.push(row);
        })
        .on('end', () => {
          resolve(records);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  create(createFsiDto: CreateFsiDto) {
    return 'This action adds a new fsi';
  }

  findAll() {
    return `This action returns all fsis`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fsi`;
  }

  

  async searchByAddress({ street, city, state, limit = 10, page = 1 }) {
    const matchStage = {
      $search: {
        index: 'default', // Use the actual name of your Atlas search index
        compound: {
          should: [],
        },
      },
    };

    if (street) {
      matchStage.$search.compound.should.push({
        text: {
          query: street,
          path: 'street',
          score: { boost: { value: 1 } },
        },
      });
    }

    if (city) {
      matchStage.$search.compound.should.push({
        text: {
          query: city,
          path: 'city',
          score: { boost: { value: 1 } },
        },
      });
    }

    if (state) {
      matchStage.$search.compound.should.push({
        text: {
          query: state,
          path: 'state',
          score: { boost: { value: 1 } },
        },
      });
    }

    const aggregation = [
      matchStage,
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [
            { $skip: (page - 1) * parseInt(limit as any) },
            { $limit: parseInt(limit as any) },
          ],
        },
      },
    ];

    const results = await this.fsisModel.aggregate(aggregation).exec();

    const total = results[0]?.metadata[0]?.total || 0;
    const data = results[0]?.data || [];

    const ids = data.map((d) => d.establishment_id);

    const demographics = await this.fsisDemoModel.find({
      establishment_id: { $in: ids },
    });

    return {
      total,
      page,
      limit,
      data: data.map((d) => ({
        ...d,
        demographics: demographics.find(
          (demo) => demo.establishment_id === d.establishment_id,
        ),
      })),
    };
  }

  update(id: number, updateFsiDto: UpdateFsiDto) {
    return `This action updates a #${id} fsi`;
  }

  remove(id: number) {
    return `This action removes a #${id} fsi`;
  }

  listPageinated({ page = 1, limit = 10 }) {
    return this.fsisModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  search(searchTerm: string) {
    return this.fsisModel.find({
      $search: {
        index: 'default',
        text: {
          query: searchTerm,
          path: {
            wildcard: '*'
          }
        }
      }
    });
  }
}
