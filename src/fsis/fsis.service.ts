import { Injectable } from '@nestjs/common';
import { CreateFsiDto } from './dto/create-fsi.dto';
import { UpdateFsiDto } from './dto/update-fsi.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FSISMPIEstablishment } from 'src/db/schemas/FSISMPIEstablishment';
import { Model } from 'mongoose';

// We can search in our atlas elastic search index for the establishment

// _id
// 66904eaa3a754fb052eac2ff
// establishment_id
// 6163327
// establishment_number
// "V17530A"
// establishment_name
// "3 Little Pigs"
// street
// "625 New Commerce Boulevard "
// city
// "Wilkes-Barre"
// state
// "PA"
// zip
// "18706"
// phone
// "(570) 823-9778"
// grant_date
// 2020-07-17T00:00:00.000+00:00
// activities
// "Certification - Export; Identification - Meat; Identification - Poultr…"
// district
// 60
// circuit
// "6014"
// size
// "N / A"
// latitude
// 41.202013008856
// longitude
// -75.92489499409
// county
// "Luzerne County"
// fips_code
// 42079

@Injectable()
export class FsisService {
  constructor(
    @InjectModel(FSISMPIEstablishment.name)
    readonly fsisModel: Model<FSISMPIEstablishment>,
  ) {}
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
          data: [{ $skip: (page - 1) * parseInt(limit as any) }, { $limit: parseInt(limit as any) }],
        },
      },
    ];

    const results = await this.fsisModel.aggregate(aggregation).exec();

    const total = results[0]?.metadata[0]?.total || 0;
    const data = results[0]?.data || [];

    return {
      total,
      page,
      limit,
      data,
    };
  }

  update(id: number, updateFsiDto: UpdateFsiDto) {
    return `This action updates a #${id} fsi`;
  }

  remove(id: number) {
    return `This action removes a #${id} fsi`;
  }
}
