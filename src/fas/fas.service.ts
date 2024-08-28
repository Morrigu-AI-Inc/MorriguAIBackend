import { Injectable } from '@nestjs/common';
import { CreateFaDto } from './dto/create-fa.dto';
import { UpdateFaDto } from './dto/update-fa.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  GATSCensusImports,
  GATSCommodity,
  GATSCountry,
  GATSCustomsDistrict,
  GATSRegion,
  GATSUnitOfMeasure,
} from 'src/db/schemas/GATSSchemas';
import { Model } from 'mongoose';
import { sleep } from 'openai/core';
import IngestionJob from 'src/db/schemas/IngestionJob';

const gatsCensureImportsAggr = () => [
  {
    $lookup: {
      from: 'gatsunitofmeasures',
      localField: 'fasConvertedUOMId',
      foreignField: 'unitOfMeasureId',
      as: 'fasConvertedUOMId',
    },
  },
  {
    $unwind: '$fasConvertedUOMId',
  },
  {
    $lookup: {
      from: 'gatsunitofmeasures',
      localField: 'censusUOMId1',
      foreignField: 'unitOfMeasureId',
      as: 'censusUOMId1',
    },
  },
  {
    $unwind: '$censusUOMId1',
  },
  {
    $set: {
      hS6Code: {
        $substr: ['$hS10Code', 0, 6],
      },
    },
  },
  {
    $lookup: {
      from: 'hs6commodities',
      localField: 'hS6Code',
      foreignField: 'hS6Code',
      as: 'hs6Details',
    },
  },
  {
    $unwind: '$hs6Details',
  },
  {
    $lookup: {
      from: 'gatscountries',
      localField: 'countryCode',
      foreignField: 'countryCode',
      as: 'countryDetails',
    },
  },
  {
    $unwind: '$countryDetails',
  },
  {
    $lookup: {
      from: 'gatscommodities',
      localField: 'hS10Code',
      foreignField: 'hS10Code',
      as: 'hS10Details',
    },
  },
  {
    $unwind: '$hS10Details',
  },
  {
    $group: {
      _id: '$countryCode',
      countryDetails: { $first: '$countryDetails' },
      hS10Details: { $first: '$hS10Details' },
      hs6Details: { $first: '$hs6Details' },
      fasConvertedUOMId: { $first: '$fasConvertedUOMId' },
      censusUOMId1: { $first: '$censusUOMId1' },
      data: { $push: '$$ROOT' },
    },
  },
];

const gatsCountries = [
  {
    $lookup: {
      from: 'gatsregions',
      localField: 'regionCode',
      foreignField: 'regionCode',
      as: 'regionDetails',
    },
  },
  {
    $unwind: '$regionDetails',
  },
];

const gatsCountriesGroupedByRegion = [
  {
    $sort: {
      regionCode: 1,
    }
  },
  {
    $lookup: {
      from: 'gatsregions',
      localField: 'regionCode',
      foreignField: 'regionCode',
      as: 'regionDetails',
    },
  },
  {
    $unwind: '$regionDetails',
  },
  {
    $group: {
      _id: '$regionCode',
      regionName: { $first: '$regionDetails.regionName' },
      countries: { $push: '$$ROOT' },
    },
  },
];

const gatsCommoditiesWithUOM = [
  {
    $lookup: {
      from: 'gatsunitofmeasures',
      localField: 'censusUOMId1',
      foreignField: 'unitOfMeasureId',
      as: 'censusUOM1',
    },
  },
  {
    $unwind: '$censusUOM1',
  },
  {
    $lookup: {
      from: 'gatsunitofmeasures',
      localField: 'censusUOMId2',
      foreignField: 'unitOfMeasureId',
      as: 'censusUOM2',
    },
  },
  {
    $unwind: '$censusUOM2',
  },
  {
    $lookup: {
      from: 'gatsunitofmeasures',
      localField: 'fasConvertedUOMId',
      foreignField: 'unitOfMeasureId',
      as: 'fasConvertedUOM',
    },
  },
  {
    $unwind: '$fasConvertedUOM',
  },
  {
    $lookup: {
      from: 'gatsunitofmeasures',
      localField: 'fasNonConvertedUOMId',
      foreignField: 'unitOfMeasureId',
      as: 'fasNonConvertedUOM',
    },
  },
  {
    $unwind: '$fasNonConvertedUOM',
  },
];

const merge = {
  $merge: {
    into: 'gats_imports_merged',
    whenMatched: 'merge', // Merge with existing documents if they exist
    whenNotMatched: 'insert', // Insert new documents if they don't exist
  },
};

const gatsCountryGroupedByYear = (countryCode: string) => {
  return [
    {
      $match: {
        countryCode: countryCode,
      },
    },

    {
      $group: {
        _id: {
          countryCode: '$countryCode',
          date: '$date',
        },
        docs: {
          $push: '$$ROOT',
        },
      },
    },
    {
      $group: {
        _id: '$_id.countryCode',
        dates: {
          $push: {
            k: '$_id.date',
            v: '$docs',
          },
        },
      },
    },
    {
      $addFields: {
        dates: {
          $arrayToObject: '$dates',
        },
      },
    },
  ];
};

const getGatsCommodities: any = (page: number = 1, limit: number = 1000) => {
  return [
    { $group: { _id: '$hS10Code', docs: { $push: '$$ROOT' } } },
    { $unwind: '$docs' },
    { $replaceRoot: { newRoot: '$docs' } },
    { $sort: { hS10Code: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ];
};

const getGATSCommoditiesByhs6: any = (
  page: number = 1,
  limit: number = 1000000,
) => {
  return [
    {
      $match: {
        isAgCommodity: true,
      },
    },
    {
      $addFields: {
        hs6Code: {
          $substr: ['$hS10Code', 0, 6],
        },
      },
    },
    {
      $group: {
        _id: '$hs6Code',
        documents: {
          $push: '$$ROOT',
        },
      },
    },
    {
      $lookup: {
        from: 'hs6commodities',
        localField: '_id',
        foreignField: 'hS6Code',
        as: 'hs6CommodityInfo',
      },
    },
    {
      $unwind: '$hs6CommodityInfo',
    },
    {
      $project: {
        _id: 0,
        hs6Code: '$_id',
        documents: 1,
        hs6CommodityInfo: 1,
      },
    },
    {
      $sort: {
        hs6Code: -1,
      },
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit,
    },
  ];
};

@Injectable()
export class FasService {
  //:partnerCode/year/:year/month/:month
  private readonly endpoints = {
    GATS_CENSUS_IMPORTS:
      'https://api.fas.usda.gov/api/gats/censusImports/partnerCode/', //:partnerCode/year/:year/month/:month
  };

  constructor(
    @InjectModel('GATSCensusImports')
    private readonly gatsCensusImportsModel: Model<GATSCensusImports>,

    @InjectModel('GATSCountry')
    private readonly gatsCountriesModel: Model<GATSCountry>,

    @InjectModel('GATSCommodity')
    private readonly gatsCommoditiesModel: Model<GATSCommodity>,

    @InjectModel('IngestionJob')
    private readonly ingestionJobModel: Model<IngestionJob>,

    @InjectModel('GATSUnitOfMeasure')
    private readonly gatsUnitOfMeasureModel: Model<GATSUnitOfMeasure>,

    @InjectModel('GATSCustomsDistrict')
    private readonly gatsCustomsDistrictModel: Model<GATSCustomsDistrict>,

    @InjectModel('GATSRegion')
    private readonly gatsRegionModel: Model<GATSRegion>,
  ) {}

  create(createFaDto: CreateFaDto) {
    return 'This action adds a new fa';
  }

  findAll() {
    return this.gatsCensusImportsModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} fa`;
  }

  update(id: number, updateFaDto: UpdateFaDto) {
    return `This action updates a #${id} fa`;
  }

  remove(id: number) {
    return `This action removes a #${id} fa`;
  }

  async getFasCensusImportsByCountryCode(match: { countryCode?: string }) {
    const results = await this.gatsCensusImportsModel.aggregate(
      gatsCountryGroupedByYear(match.countryCode),
    );

    console.log('Results: ', results);

    return results[0];
  }

  async getFasCensusImportsAggr(match, page = 1, limit = 5000) {
    // we need to group on countryCode
    const results = await this.gatsCensusImportsModel.aggregate(
      gatsCensureImportsAggr(),
    );

    console.log('Results: ', results);

    return results;
  }

  async getFasCountries() {
    return await this.gatsCountriesModel.aggregate(gatsCountries);
  }

  async getFasCountriesGroupedByRegion() {
    return await this.gatsCountriesModel.aggregate(
      gatsCountriesGroupedByRegion as any,
    );
  }

  async getFasCommoditiesWithUOM() {
    return await this.gatsCommoditiesModel.aggregate(gatsCommoditiesWithUOM);
  }

  async mergeGatsImports() {
    return await this.gatsCensusImportsModel.aggregate(
      gatsCensureImportsAggr(),
    );
  }

  async getFasCensurImportsHistoryicalsJob() {
    // get the countries first
    const countries = await this.getFasCountries();
    const cCodes = countries.map((c) => c.countryCode);
    console.log(cCodes);
    // years can range from 1980 to 2021
    // months can range from 01 to 12
    // we will get the data for the year 2021 and month 01
    // for each country code

    // lets do it a bit backwards

    // loop years first

    for (let year = new Date().getFullYear() - 1; year >= 1980; year--) {
      // loop months
      for (let month = 12; month >= 1; month--) {
        // loop countries
        for (const cCode of cCodes) {
          // get the data for the country code
          // for the year and month
          const url = `${this.endpoints.GATS_CENSUS_IMPORTS}${cCode}/year/${year}/month/${month < 10 ? `0${month}` : month}`;

          // check if the data is already ingested
          const job = await this.ingestionJobModel.findOne({ url });

          if (job && job.isIngested) {
            console.log('Data already ingested');
            continue;
          }
fetch('https://api.importyeti.com/api/bols/power', {
  headers: {
    accept: 'application/json, text/plain, */*',
    'accept-language': 'en-US,en;q=0.9',
    'cache-control': 'no-cache',
    'content-type': 'application/json',
    pragma: 'no-cache',
    priority: 'u=1, i',
    'sec-ch-ua':
      '"Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    cookie:
      '_ga=GA1.1.1653794473.1723743668; importyeti_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiSmFzb25AbW9ycmlndS5haSIsImlhdCI6MTcyMzc0ODY4OCwiZXhwIjoxNzI2MzQwNjg4fQ.uI79UmIJTn1st7aXpQOrxScPouer93TmbWxnJ3Gat-w; cf_clearance=vxuqQrHIdCM0oABtXNx9J2S0npo0n._QaL9XFq_fILc-1724456808-1.2.1.1-agwczBkLohohpCJ5PTL3lirJ08Q2IqufJowiTk_hk.rJ8T6438uR9PBzZkkQGuClofK4sqTKERUJAWy3nwBsGJBBTWWkID5RDblq663l9wU5MSjBOsaiS7wwlzHdsdVzSxGCOWuF6X4wg_UqPe3NbsuBR2jFuO7QC7lF1ZMiGme5JAPt4XIMo9pbM__QUwxiedo.18RAg35XWdTIcx5szUZIdXseADCUH8mNIi5XRobOpMRObATcnUPzlweS31zCa3uFkS45fYahT5Vw8Mw0sOq.UCAruMR5gvgxyMqZM2ur72mxS8AMX7QRdE6DWwRnBjuRgqK7fNCwlO57Oe7rMotx4OjcD8OExtvE7J7XZ1lQ_JgxCwe2QgmbEvedkUf0aAx50__ExNmGv3zwAEjeOA; AWSALB=7mzGYF7yaA9BZ+MTksndBNgK4us7bMiSSevWbq0oWFT0qWpCYZB+9PI2c9Bh75z4NAOX/Ohbq4QW7hRMRc8fb9l8UeoA4ZR/Ol8miq1UGY/zmDZm2xW9T40KWp86; AWSALBCORS=7mzGYF7yaA9BZ+MTksndBNgK4us7bMiSSevWbq0oWFT0qWpCYZB+9PI2c9Bh75z4NAOX/Ohbq4QW7hRMRc8fb9l8UeoA4ZR/Ol8miq1UGY/zmDZm2xW9T40KWp86; _ga_L3P3RK1QKT=GS1.1.1724456808.11.1.1724456826.0.0.0',
    Referer: 'https://www.importyeti.com/',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  },
  body: '{"fieldItems":[{"fieldId":"jijR7-MI9AfatNKEvZVc3","fieldName":"company_or_supplier","value":"Apple","queryType":"EXACT_PHRASE","or":[]}],"startDate":"2024-07-16T15:31:18.951Z","endDate":"2024-08-16T15:32:56.303Z","optionalFilterStates":{"has_contact_info":false,"has_website":false,"only_lcl":false,"use_raw":false},"sortBy":"arrival_date","isMexicoImport":false,"isUsExport":false,"pagination":{"from":0,"size":10}}',
  method: 'POST',
});
          console.log('Fetching data from: ', url);

          await this.ingestionJobModel.create({
            url,
            isIngested: false,
          });

          const response = await fetch(url, {
            headers: {
              'X-Api-Key': process.env.DATA_GOV_API,
            },
          });

          if (response.status !== 200) {
            console.log('Error fetching data', response.status, response.body);
            continue;
          } else {
            const data = await response.json();

            if (data.length > 0) {
              console.log('Data length: ', data.length);
              console.log('Data: ', data);
              // bulk insert the data
              await this.gatsCensusImportsModel.insertMany(data);

              // update the ingestion job
            }

            await this.ingestionJobModel.findOneAndUpdate(
              { url },
              { isIngested: true },
            );

            await sleep(1500);
          }
        }
      }
    }

    // get the data from the url
  }

  // GATS Commodities
  async getGatsCommodities(page = 1, limit = 1000) {
    return await this.gatsCommoditiesModel.aggregate(
      getGatsCommodities(page, limit),
    );
  }

  async getGatsCommoditiesByhs6(page = 1, limit = 1000) {
    return await this.gatsCommoditiesModel.aggregate(
      getGATSCommoditiesByhs6(page, limit),
    );
  }

  // settings
  async getSettings() {
    return {
      settings: {
        name: 'FAS Settings',
        version: '1.0.0',
        description: 'Foreign Agricultural Service',
        endpoints: {
          gats: {
            censusImports: {
              description: 'GATS Census Imports',
              url: 'https://api.fas.usda.gov/api/gats/censusImports/partnerCode/:partnerCode/year/:year/month/:month',
            },
          },
          psd: {
            description: 'Production, Supply, and Distribution',
            url: 'https://api.fas.usda.gov/api/psd',
          },
          ers: {
            description: 'Economic Research Service',
            url: 'https://api.fas.usda.gov/api/ers',
          },
        },
        gats: {
          regions: await this.gatsCustomsDistrictModel.find(),
          uoms: await this.gatsUnitOfMeasureModel.find(),
          hs6Commodities: await this.gatsCommoditiesModel.aggregate(
            getGATSCommoditiesByhs6(1, 1000000),
          ),
          countries: await this.gatsCountriesModel.find(),
          customsDistricts: await this.gatsCustomsDistrictModel.find(),
        },
      },
    };
  }
}
