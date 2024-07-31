import { Injectable } from '@nestjs/common';
import { CreateUsdaDatumDto } from './dto/create-usda_datum.dto';
import { UpdateUsdaDatumDto } from './dto/update-usda_datum.dto';
import * as cheerio from 'cheerio'; // Import the 'cheerio' library
import { InjectModel } from '@nestjs/mongoose';
import { Model, set } from 'mongoose';
import { MediaDocument, Organization } from 'src/db/schemas';
import { USDAReportDocument } from 'src/db/schemas/USDAReport';
import { OpenaiService } from 'src/openai/openai.service';
import {
  analyze_cattle_on_feed_stats,
  analyze_livestock_slaughter_report,
  summary_usda_report,
} from './entities/usda_analyze_prompt_commands';

// This is a service file. This will pull data from USDA reports and store it in the database.

export enum USDA_REPORT_TYPES_ENUM {
  LIVESTOCK_SLAUGHTER = 'lstk',
}

export enum USDA_REPORTS_TYPES {
  lstk = 'rx913p88g',
  acrg = 'j098zb09z',
  agpr = 'c821gj76b',
  brls = 'gm80hv35d',
  rfwh = 'x059c7329',
  cfpd = 'bg257f046',
  catl = 'h702q636h',
  cact = 'ng451h506',
  cactan = 'kp78gg381',
  cafo = 'mp48sc77c',
  cafc = 'n583xt96p',
  CATTLE_ON_FEED = 'm326m174z',
  ckeg = 'fb494842n',
  ckegan = '1v53jw96n',
  crop = 'tm70mv177',
  cfrt = 'j9602060k',
  cfrtca = '8g84mp55s',
  cafean = '3t945q80c',
  cost = 'pg15bd892',
  costan = 'sb397824g',
  cstpol = 'd504rk335',
  ctgn = 'q524jn76v',
  ctgnan = '6108vb275',
  prog = '8336h188j',
  ctvl = 'k35694332',
  DAIRY_PRODUCTS = 'm326m1757',
}

const USDA_DOWNLOADS_URL =
  'https://downloads.usda.library.cornell.edu/usda-esmis/files/';

const USDA_PAGE_SCRAPER_BASE_URL =
  'https://usda.library.cornell.edu/concern/publications/';

// these are the pages that needs to be scraped for the data
const URL_DOWNLOADS_PAGE_MAPPINGS = {
  LIVESTOCK: `${USDA_PAGE_SCRAPER_BASE_URL}${USDA_REPORTS_TYPES.lstk}`,
  // acrg: `${USDA_PAGE_SCRAPER_BASE_URL}${USDA_REPORTS_TYPES.acrg}`,
  // agpr: `${USDA_PAGE_SCRAPER_BASE_URL}${USDA_REPORTS_TYPES.agpr}`,
  // brls: `${USDA_PAGE_SCRAPER_BASE_URL}${USDA_REPORTS_TYPES.brls}`,
  // rfwh: `${USDA_PAGE_SCRAPER_BASE_URL}${USDA_REPORTS_TYPES.rfwh}`,
  // cfpd: `${USDA_PAGE_SCRAPER_BASE_URL}${USDA_REPORTS_TYPES.cfpd}`,
  // catl: `${USDA_PAGE_SCRAPER_BASE_URL}${USDA_REPORTS_TYPES.catl}`,
  // cact: `${USDA_PAGE_SCRAPER_BASE_URL}${USDA_REPORTS_TYPES.cact}`,
  // cactan: `${USDA_PAGE_SCRAPER_BASE_URL}${USDA_REPORTS_TYPES.cactan}`,
  // cafo: `${USDA_PAGE_SCRAPER_BASE_URL}${USDA_REPORTS_TYPES.cafo}`,
  // cafc: `${USDA_PAGE_SCRAPER_BASE_URL}${USDA_REPORTS_TYPES.cafc}`,
  CATTLE_ON_FEED: `${USDA_PAGE_SCRAPER_BASE_URL}${USDA_REPORTS_TYPES.CATTLE_ON_FEED}`,
  // ckeg: `${USDA_PAGE_SCRAPER_BASE_URL}${USDA_REPORTS_TYPES.ckeg}`,
  // ckegan: `${USDA_PAGE_SCRAPER_BASE_URL}${USDA_REPORTS_TYPES.ckegan}`,
  // crop: `${USDA_PAGE_SCRAPER_BASE_URL}${USDA_REPORTS_TYPES.crop}`,
  // cfrt: `${USDA_PAGE_SCRAPER_BASE_URL}${USDA_REPORTS_TYPES.cfrt}`,
  // cfrtca: `${USDA_PAGE_SCRAPER_BASE_URL}${USDA_REPORTS_TYPES.cfrtca}`,
  // cafean: `${USDA_PAGE_SCRAPER_BASE_URL}${USDA_REPORTS_TYPES.cafean}`,
  // cost: `${USDA_PAGE_SCRAPER_BASE_URL}${USDA_REPORTS_TYPES.cost}`,
  // costan: `${USDA_PAGE_SCRAPER_BASE_URL}${USDA_REPORTS_TYPES.costan}`,
  // cstpol: `${USDA_PAGE_SCRAPER_BASE_URL}${USDA_REPORTS_TYPES.cstpol}`,
  // ctgn: `${USDA_PAGE_SCRAPER_BASE_URL}${USDA_REPORTS_TYPES.ctgn}`,
  // ctgnan: `${USDA_PAGE_SCRAPER_BASE_URL}${USDA_REPORTS_TYPES.ctgnan}`,
  // prog: `${USDA_PAGE_SCRAPER_BASE_URL}${USDA_REPORTS_TYPES.prog}`,
  // ctvl: `${USDA_PAGE_SCRAPER_BASE_URL}${USDA_REPORTS_TYPES.ctvl}`,
  // DAIRY_PRODUCTS: `${USDA_PAGE_SCRAPER_BASE_URL}${USDA_REPORTS_TYPES.DAIRY_PRODUCTS}`,
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
    @InjectModel('USDAReport')
    private readonly usdaModel: Model<USDAReportDocument>,

    private readonly openAiService: OpenaiService,
  ) {}
  create(createUsdaDatumDto: CreateUsdaDatumDto) {
    return 'This action adds a new usdaDatum';
  }

  async findAll(page: number, limit: number) {
    // where generatedSummary length is greater than 0
    const reports = await this.usdaModel
      .find({ generatedSummary: { $exists: true, $ne: [] } })
      .skip((page - 1) * limit)
      .limit(limit);

    return reports;
  }

  findOne(id: number) {
    return `This action returns a #${id} usdaDatum`;
  }

  findBySlug(slug: string) {
    return this.usdaModel.findOne({
      slug,
    });
  }

  update(id: number, updateUsdaDatumDto: UpdateUsdaDatumDto) {
    return `This action updates a #${id} usdaDatum`;
  }

  remove(id: number) {
    return `This action removes a #${id} usdaDatum`;
  }

  // CRONS Below
  async runAILogicOnUsdaReport(
    owner: string,
    type: USDA_REPORT_TYPES_ENUM = USDA_REPORT_TYPES_ENUM.LIVESTOCK_SLAUGHTER,
  ) {
    const messages2 = [
      {
        role: 'assistant',
        content: 'Writing the report now.',
      },
    ];

    if (type === USDA_REPORT_TYPES_ENUM.LIVESTOCK_SLAUGHTER) {
      const allLstk = await this.usdaModel.find({
        reportType: USDA_REPORT_TYPES_ENUM.LIVESTOCK_SLAUGHTER,
      });

      console.log(allLstk.length);

      // loop through all the livestock slaughter reports and analyze them

      // run the AI logic on the report

      const all = [];
      for (let i = 0; i < allLstk.length; i++) {
        const report = allLstk[i];

        let d: any = await this.openAiService.runSingleCall(
          analyze_livestock_slaughter_report(report.fullText),
          messages2,
          owner,
          {
            mode: 'json',
          },
        );

        const textVal = d.data[0].content[0].text.value;
        d = JSON.parse(textVal);

        const updated = await this.usdaModel.findOneAndUpdate(
          { _id: report._id },
          {
            $set: {
              'generated.lstk': d,
            },
          },
          { new: true },
        );

        console.log(updated);

        all.push(updated);
      }

      return all;
    }

    return [];
  }
  async scrapeUsdaData() {
    for (const pageType of Object.keys(USDA_REPORTS_TYPES)) {
      setTimeout(() => {}, 1000);
      console.log('Scraping:', pageType);
      await this.scrapeUsdaPage(pageType as USDA_REPORTS_TYPES);
    }
  }

  async downloadUsdaData() {
    // download the data
  }

  async saveUsdaData() {
    // save the data to the database
  }

  async scrapeUsdaPage(pageType: USDA_REPORTS_TYPES) {
    let page = 1;
    const allReports = [];
    let hasMorePages = true;

    console.log('Scraping:', pageType);

    while (hasMorePages) {
      try {
        if (!URL_DOWNLOADS_PAGE_MAPPINGS[pageType]) {
          hasMorePages = false;
          break;
        }

        const response = await fetch(
          `${URL_DOWNLOADS_PAGE_MAPPINGS[pageType]}?locale=en&page=${page}`,
        );

        if (!response.ok) {
          hasMorePages = false;
          break;
        }

        const html = await response.text();
        const $ = cheerio.load(html);
        const links = $('a');

        const downloadLinks = links
          .map((i, link) => link.attribs.href)
          .get()
          .filter((link) => link.startsWith(USDA_DOWNLOADS_URL));

        const pdfLinks = downloadLinks.filter((link) => link.endsWith('.pdf'));
        const txtLinks = downloadLinks.filter((link) => link.endsWith('.txt'));

        for (let i = 0; i < txtLinks.length; i++) {
          setTimeout(() => {}, 1000);
          const response = await fetch(txtLinks[i]);
          const data = await response.text();

          const foundReport = await this.usdaModel.findOne({
            textLink: txtLinks[i],
            pdfLink: pdfLinks[i],
          });

          if (foundReport) {
            continue;
          }

          const report = new this.usdaModel({
            textLink: txtLinks[i],
            pdfLink: pdfLinks[i],
            fullText: data,
            reportType: pageType,
          });

          await report.save();

          allReports.push(report);
        }

        page++;
      } catch (err) {
        console.error(err);
        hasMorePages = false;
      }
    }

    return allReports;
  }
}
