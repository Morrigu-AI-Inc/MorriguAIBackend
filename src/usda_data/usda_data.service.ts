import { Injectable } from '@nestjs/common';
import { CreateUsdaDatumDto } from './dto/create-usda_datum.dto';
import { UpdateUsdaDatumDto } from './dto/update-usda_datum.dto';
import * as cheerio from 'cheerio'; // Import the 'cheerio' library
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MediaDocument } from 'src/db/schemas';

// This is a service file. This will pull data from USDA reports and store it in the database.

export enum USDA_REPORTS_TYPES {
  lstk = 'rx913p88g',
}

const USDA_DOWNLOADS_URL =
  'https://downloads.usda.library.cornell.edu/usda-esmis/files/';

const USDA_PAGE_SCRAPER_BASE_URL =
  'https://usda.library.cornell.edu/concern/publications/';

// these are the pages that needs to be scraped for the data
const URL_DOWNLOADS_PAGE_MAPPINGS = {
  lstk: `${USDA_PAGE_SCRAPER_BASE_URL}${USDA_REPORTS_TYPES.lstk}`,
};

//  FOR ALL MEDIA  MediaDocument includes the following fields
// @Prop({ required: true })
// name: string;

// @Prop({ required: false })
// url: string;

// @Prop({ required: true })
// type: string;

// @Prop({ required: false })
// size: number;

// @Prop({ required: false })
// blob: Buffer;

// @Prop({ required: true })
// s3_key: string;

@Injectable()
export class UsdaDataService {
  constructor(
    @InjectModel('Media') private readonly mediaModel: Model<MediaDocument>,
  ) {}
  create(createUsdaDatumDto: CreateUsdaDatumDto) {
    return 'This action adds a new usdaDatum';
  }

  findAll() {
    return `This action returns all usdaData`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usdaDatum`;
  }

  update(id: number, updateUsdaDatumDto: UpdateUsdaDatumDto) {
    return `This action updates a #${id} usdaDatum`;
  }

  remove(id: number) {
    return `This action removes a #${id} usdaDatum`;
  }

  // CRONS Below
  async scrapeUsdaData() {
    Object.keys(USDA_REPORTS_TYPES).forEach((pageType) => {
      this.scrapeUsdaPage(pageType as USDA_REPORTS_TYPES);
    });
    // scrape the page for the data
    // download the data
    // save the data to the database
  }

  async downloadUsdaData() {
    // download the data
  }

  async saveUsdaData() {
    // save the data to the database
  }

  async scrapeUsdaPage(pageType: USDA_REPORTS_TYPES) {
    // scrape the page for the data
    fetch(URL_DOWNLOADS_PAGE_MAPPINGS[pageType])
      .then((response) => response.text())
      .then(async (html) => {
        const $ = cheerio.load(html);
        const links = $('a');

        // filter out the ones that dont start with the download url they must also end in
        const downloadLinks = links
          .map((i, link) => link.attribs.href)
          .get()
          .filter((link) => link.startsWith(USDA_DOWNLOADS_URL));

        // filter out the ones that dont end in .txt
        const txtLinks = downloadLinks.filter((link) => link.endsWith('.txt'));

        const allLinks = await Promise.all(txtLinks.map((link) => fetch(link)));

        const data = await Promise.all(allLinks.map((link) => link.text()));

        // get all pdfs and download them
        const pdfLinks = downloadLinks.filter((link) => link.endsWith('.pdf'));

        const pdfs = await Promise.all(pdfLinks.map((link) => fetch(link)));

        const pdfData = await Promise.all(pdfs.map((link) => link.text()));

        console.log(pdfData);

        // console.log(data);
      })
      .catch((err) => console.error(err));
  }
}
