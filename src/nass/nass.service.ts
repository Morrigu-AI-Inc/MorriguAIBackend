import { Injectable } from '@nestjs/common';
import { CreateNassDto } from './dto/create-nass.dto';
import { UpdateNassDto } from './dto/update-nass.dto';

// URLS OF IMPORTANCE

// https://quickstats.nass.usda.gov/api/get_param_values?key=${process.env.QUICKSTATS_API_KEY}&
// This is the URL to get the list of all the parameters that can be used in the API it return a list of all the parameters that can be used in the API

// https://quickstats.nass.usda.gov/api/get_counts?key=${process.env.QUICKSTATS_API_KEY}&
// This is the URL to get the count of the data that is available in the API

// https://quickstats.nass.usda.gov/api/api_GET/?key=${process.env.QUICKSTATS_API_KEY}&source_desc=CENSUS&commodity_desc=CORN&year=2012&format=JSON
// This is the URL to get the data from the API it returns the data from the API

// process.env.QUICKSTATS_API_KEY - This is the environment variable that will be used to store the API key
/**
 * This is the list of all the fields that are available in the API
 */

type CountryCode = "9000" | "9030" | "9110" | "9350" | "9510" | "9610";
type GroupDesc = 
  "ANIMAL TOTALS" |
  "AQUACULTURE" |
  "COMMODITIES" |
  "CROP TOTALS" |
  "DAIRY" |
  "ENERGY" |
  "EXPENSES" |
  "FARMS & LAND & ASSETS" |
  "FIELD CROPS" |
  "FRUIT & TREE NUTS" |
  "HORTICULTURE" |
  "INCOME" |
  "IRRIGATION" |
  "LIVESTOCK" |
  "OPERATORS" |
  "POULTRY" |
  "PRICES PAID" |
  "PRODUCERS" |
  "SPECIALTY" |
  "VEGETABLES";
  // "AQUACULTURE",
  // "COMMODITIES",
  // "CROP TOTALS",
  // "DAIRY",
  // "ENERGY",
  // "EXPENSES",
  // "FARMS & LAND & ASSETS",
  // "FIELD CROPS",
  // "FRUIT & TREE NUTS",
  // "HORTICULTURE",
  // "INCOME",
  // "IRRIGATION",
  // "LIVESTOCK",
  // "OPERATORS",
  // "POULTRY",
  // "PRICES PAID",
  // "PRODUCERS",
  // "SPECIALTY",
  // "VEGETABLES"

// four digit year start at 1850 and going till current year in string form
 
enum PARAMS {
  'asd_desc' = 'asd_desc',
  'asd_code' = 'asd_code',
  'statisticcat_desc' = 'statisticcat_desc',
  'domaincat_desc' = 'domaincat_desc',
  'Value' = 'Value',
  'country_code' = 'country_code',
  'begin_code' = 'begin_code',
  'domain_desc' = 'domain_desc',
  'state_alpha' = 'state_alpha',
  'zip_5' = 'zip_5',
  'group_desc' = 'group_desc',
  'freq_desc' = 'freq_desc',
  'source_desc' = 'source_desc',
  'reference_period_desc' = 'reference_period_desc',
  'county_code' = 'county_code',
  'short_desc' = 'short_desc',
  'agg_level_desc' = 'agg_level_desc',
  'week_ending' = 'week_ending',
  'load_time' = 'load_time',
  'congr_district_code' = 'congr_district_code',
  'prodn_practice_desc' = 'prodn_practice_desc',
  'class_desc' = 'class_desc',
  'end_code' = 'end_code',
  'util_practice_desc' = 'util_practice_desc',
  'year' = 'year',
  'state_name' = 'state_name',
  'county_ansi' = 'county_ansi',
  'country_name' = 'country_name',
  'state_ansi' = 'state_ansi',
  'region_desc' = 'region_desc',
  'watershed_desc' = 'watershed_desc',
  'unit_desc' = 'unit_desc',
  'county_name' = 'county_name',
  'state_fips_code' = 'state_fips_code',
  'sector_desc' = 'sector_desc',
  'watershed_code' = 'watershed_code',
  'location_desc' = 'location_desc',
  'commodity_desc' = 'commodity_desc',
}

@Injectable()
export class NassService {
  create(createNassDto: CreateNassDto) {
    return 'This action adds a new nass';
  }

  /**
   * In this we will allow us to get the list of the possible values for a given parameter
   * @returns
   */
  async getParamValues(param: {
    [key in PARAMS]: string;
  }) {
    const urlparams = new URLSearchParams({
      key: process.env.QUICKSTATS_API_KEY,
      ...param,
    });
    const url = `https://quickstats.nass.usda.gov/api/get_param_values?${urlparams}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  /**
   * This will allow us to get the count of the data that is available in the API
   * @returns
   */
  async getCounts(params: {
    [key in PARAMS]: string;
  }) {
    const urlparams = new URLSearchParams({
      key: process.env.QUICKSTATS_API_KEY,
      ...params,
    });

    const url = `https://quickstats.nass.usda.gov/api/get_counts?${urlparams}`;
    const response = await fetch(url);

    const data = await response.json();

    return data;
  }

  /**
   * This will allow us to get the data from the API
   * @returns
   */
  async getData(params: {
    [key in PARAMS]: string;
  }) {
    const urlparams = new URLSearchParams({
      key: process.env.QUICKSTATS_API_KEY,
      ...params,
    });

    const url = `https://quickstats.nass.usda.gov/api/api_GET?${urlparams}`;
    const response = await fetch(url);

    const data = await response.json();

    return data;
  }

  findAll() {
    return `This action returns all nass`;
  }

  findOne(id: number) {
    return `This action returns a #${id} nass`;
  }

  update(id: number, updateNassDto: UpdateNassDto) {
    return `This action updates a #${id} nass`;
  }

  remove(id: number) {
    return `This action removes a #${id} nass`;
  }
}
