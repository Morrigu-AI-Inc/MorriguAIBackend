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
  livestock_slaughter_report_json_schema,
  summary_usda_report,
} from './entities/usda_analyze_prompt_commands';

// This is a service file. This will pull data from USDA reports and store it in the database.

export enum USDA_REPORT_TYPES_ENUM {
  LIVESTOCK = 'LIVESTOCK',
}

export enum USDA_REPORTS_TYPES {
  LIVESTOCK = 'rx913p88g',
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
  LIVESTOCK: `${USDA_PAGE_SCRAPER_BASE_URL}${USDA_REPORTS_TYPES.LIVESTOCK}`,
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
    @InjectModel('Organization')
    private readonly organizationModel: Model<Organization>,

    private readonly openAiService: OpenaiService,
  ) {}
  create(createUsdaDatumDto: CreateUsdaDatumDto) {
    return 'This action adds a new usdaDatum';
  }

  private unique = {
    'Commercial Cattle Slaughter - States and United States':
      livestock_slaughter_report_json_schema.properties
        .commercial_slaughter_states_structured,
    'Livestock Slaughter and Average Live Weight - United States':
      livestock_slaughter_report_json_schema.properties
        .livestock_slaughter_and_average_live_weight_structured,
    'Livestock Slaughter, Number of Head, and Average Live Weight - United States':
      livestock_slaughter_report_json_schema.properties
        .livestock_slaughter_and_average_live_weight_structured,
    'Livestock Slaughter, Number of Head and Average Live Weight - United States':
      livestock_slaughter_report_json_schema.properties
        .livestock_slaughter_and_average_live_weight_structured,
    'Federally Inspected Slaughter, Average Dressed Weight, by Class - United States':
      livestock_slaughter_report_json_schema.properties
        .federally_inspected_slaughter_average_dressed_weight_by_class,
    'Livestock Slaughtered Under Federal Inspection, By Class - United States':
      livestock_slaughter_report_json_schema.properties
        .livestock_slaughtered_federal_inspection_by_class,
    'Federally Inspected Slaughter, Average Dressed Weight, By Class - United States':
      livestock_slaughter_report_json_schema.properties
        .federally_inspected_slaughter_average_dressed_weight_by_class,
    'Federally Inspected Slaughter, Average Dressed Weight, By Class - United \r\nStates':
      livestock_slaughter_report_json_schema.properties
        .federally_inspected_slaughter_average_dressed_weight_by_class,
    'Commercial Calf Slaughter - States and United States':
      livestock_slaughter_report_json_schema.properties
        .commercial_calf_slaughter_states_structured,
    // "Federally Inspected Slaughter - Regions and United States": livestock_slaughter_report_json_schema.properties.fed,
    'Commercial Sheep and Lamb Slaughter - States and United States':
      livestock_slaughter_report_json_schema.properties
        .commercial_sheep_lamb_slaughter_states_structured,
    'Commercial Red Meat Production - United States':
      livestock_slaughter_report_json_schema.properties
        .commercial_red_meat_production_structured,
    'Federally Inspected Slaughter, Percent of Total Commercial Slaughter - United States':
      livestock_slaughter_report_json_schema.properties
        .federally_inspected_slaughter_percent_of_total_commercial_slaughter_us,
    // "Statistical Methodology",
    'Federally Inspected Slaughter, Percent of Total Commercial Slaughter - United \r\nStates':
      livestock_slaughter_report_json_schema.properties
        .federally_inspected_slaughter_percent_of_total_commercial_slaughter_us,
    'Commercial Hog Slaughter - States and United States':
      livestock_slaughter_report_json_schema.properties
        .commercial_hog_slaughter_states_structured,
    'Federally Inspected Slaughter Percent of Total Commercial Slaughter - United States':
      livestock_slaughter_report_json_schema.properties
        .federally_inspected_slaughter_percent_of_total_commercial_slaughter_us,
    'Federally Inspected Slaughter, Average Dressed Weight, By Class - \r\nUnited States':
      livestock_slaughter_report_json_schema.properties
        .federally_inspected_slaughter_average_dressed_weight_by_class,
    'Federally Inspected Slaughter, Percent of Total Commercial Slaughter - \r\nUnited States':
      livestock_slaughter_report_json_schema.properties
        .federally_inspected_slaughter_percent_of_total_commercial_slaughter_us,
    'Federally Inspected Slaughter Average Dressed Weight, By Class - United \r\nStates':
      livestock_slaughter_report_json_schema.properties
        .federally_inspected_slaughter_average_dressed_weight_by_class,
    'Livestock Slaughtered Under Federal Inspection by Class - United States':
      livestock_slaughter_report_json_schema.properties
        .livestock_slaughtered_federal_inspection_by_class,
    'Federally Inspected Red Meat Production - United States':
      livestock_slaughter_report_json_schema.properties
        .federally_inspected_red_meat_production_structured,
    'Commercial Red Meat Production - States and United States':
      livestock_slaughter_report_json_schema.properties
        .commercial_red_meat_production_states_structured,
    'Federally Inspected Slaughter, Average Dressed Weight by Class - United States':
      livestock_slaughter_report_json_schema.properties
        .federally_inspected_slaughter_average_dressed_weight_by_class,
    'Federally Inspected Slaughter Average Dressed Weight by Class - United States':
      livestock_slaughter_report_json_schema.properties
        .federally_inspected_slaughter_average_dressed_weight_by_class,
    'Livestock Slaughtered Under Federal Inspection, by Class - United States':
      livestock_slaughter_report_json_schema.properties
        .livestock_slaughtered_federal_inspection_by_class,
  };

  async matchPartsToSchema() {
    const reports = await this.usdaModel.find({
      reportType: USDA_REPORT_TYPES_ENUM.LIVESTOCK,
      // _id: '66a9defbdc9d7bfd3e66b1a1'
    });
    const results = [];

    for (let i = 0; i < reports.length; i++) {
      try {
        const report = reports[i];
        const extracted = report.generated.lstk.extracted.objTocItems;

        const keys = Object.keys(extracted);

        const matched = {};

        for (let j = 0; j < keys.length; j++) {
          const key = keys[j];
          const splitKey = key.split(':');
          const firstKey = splitKey[0].trim();

          if (this.unique[firstKey]) {
            matched[key] = {
              schema: this.unique[firstKey],
              doc: extracted[key].join('\r\n'),
            };
          }
        }

        report.generated.lstk.matched = matched;

        await this.usdaModel.findOneAndUpdate(
          { _id: report._id },
          {
            $set: {
              'generated.lstk.matched': matched,
            },
          },
          { new: true },
        );

        results.push(matched);
      } catch (e) {
        console.error(e);
        continue;
      }
    }

    console.log('Results: ', results);
  }

  async buildTableCommands() {
    const temp = (schema, doc) => {
      return `
      You are extracting USDA Data from a USDA Progress Report. The report contains a table that looks like the following:

      =========== DOCUMENT =============
      ${doc}
      ==================================



      Extract data from the document above and return it as a JSON object that matches the given schema. Follow the structure and rules specified in the schema, but do not include the schema itself or its definitions in the response.

      =========== SCHEMA ==============
      ${JSON.stringify(schema, null, 2)}
      ==================================
      `;
    };

    const reports = await this.usdaModel.find({
      reportType: USDA_REPORT_TYPES_ENUM.LIVESTOCK,
    });

    const results = [];

    for (let i = 0; i < reports.length; i++) {
      try {
        const report = reports[i];
        const matched = report.generated.lstk.matched;
        const keys = Object.keys(matched);

        const commands = [];

        for (let j = 0; j < keys.length; j++) {
          const key = keys[j];
          const schema = matched[key].schema;
          const doc = matched[key].doc;

          const command = temp(schema, doc);

          console.log('Command: ', command);

          commands.push(command);
        }

        report.generated.lstk.commands = commands;

        await this.usdaModel.findOneAndUpdate(
          { _id: report._id },
          {
            $set: {
              'generated.lstk.commands': commands,
            },
          },
          { new: true },
        );

        results.push(commands);
      } catch (e) {
        console.error(e);
        continue;
      }
    }

    console.log('Results: ', results);

    return results;
  }

  async runCommands(owner) {
    const reports = await this.usdaModel.find({
      reportType: USDA_REPORT_TYPES_ENUM.LIVESTOCK,
    });
  
    const maxRequestsPerMinute = 1000;
    const timeInterval = 60000; // 60 seconds
    let requestCount = 0;
    let startTime = Date.now();
  
    for (let i = 0; i < reports.length; i++) {
      try {
        const report = reports[i];
        const commands = report.generated.lstk.commands;
        const commandPromises = [];
  
        for (let j = 0; j < commands.length; j++) {
          // Check if we've reached the rate limit
          if (requestCount >= maxRequestsPerMinute) {
            const elapsedTime = Date.now() - startTime;
            if (elapsedTime < timeInterval) {
              const waitTime = timeInterval - elapsedTime;
              console.log(`Rate limit reached, waiting for ${waitTime}ms`);
              await new Promise((resolve) => setTimeout(resolve, waitTime));
            }
            requestCount = 0;
            startTime = Date.now();
          }
  
          const command = commands[j];
  
          // Create a promise for each command and push to array
          const commandPromise = this.openAiService
            .runSingleCall(
              command,
              [
                {
                  role: 'assistant',
                  content:
                    'Extracting the data now. I will follow the schema provided and return the data in JSON format.',
                },
              ],
              owner,
              { mode: 'json' }
            )
            .then((response) => {
              const textVal = (response as any).data[0].content[0].text.value;
              const parsedData = JSON.parse(textVal);
  
              console.log('Parsed Data:', parsedData);
  
              return this.usdaModel.findOneAndUpdate(
                { _id: report._id },
                {
                  $set: {
                    [`generated.lstk.${Object.keys(parsedData)[0]}`]:
                      parsedData[Object.keys(parsedData)[0]],
                  },
                },
                { new: true }
              );
            })
            .then((updated) => {
              console.log('Updated', report._id);
            })
            .catch((e) => {
              console.error(e);
            });
  
          commandPromises.push(commandPromise);
  
          requestCount++;
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before the next iteration
        }
  
        // Wait for all command promises to resolve before moving to the next report
        await Promise.all(commandPromises);
      } catch (e) {
        console.error(e);
      }
    }
  
    return this.usdaModel.find({
      reportType: USDA_REPORT_TYPES_ENUM.LIVESTOCK,
    });
  }

  async SplitReportsOnToC() {
    const reports = await this.usdaModel.find({
      reportType: USDA_REPORT_TYPES_ENUM.LIVESTOCK,
    });
    const results = [];
    console.log(
      JSON.stringify(
        livestock_slaughter_report_json_schema.properties
          .federally_inspected_red_meat_production_structured,
        null,
        2,
      ),
    );
    for (let i = 0; i < reports.length; i++) {
      try {
        const report = reports[i];
        const text = report.fullText;

        const spitReport = text.split('This page intentionally left blank.');

        const summaryPage = spitReport[0];
        const reportData = spitReport[1];
        const tocData = reportData
          ?.split('Terms and Definitions Used for ')[0]
          .split('Contents')[1]
          .match(/^[^\.]+(?=\s*\.+\s*\d+)/gm)
          .map((x) => x.trim());

        const regex = new RegExp(tocData?.join('|'), 'g');

        // Split the report by the headers and filter out any empty strings
        const sections = text
          .split(regex)
          .filter((section) => section.trim() !== '');

        sections[0] = sections[0].split(
          'This page intentionally left blank.',
        )[1];

        // splice the first off the sections and remove
        sections.shift();
        // clean up the ToC data

        // we are going to split the text into sections
        // First we need to extract the ToC (Table of Contents)

        // Then we will extract the tables into chunks for further analysis
        const tocRegex = '';

        let tables = reportData
          ?.split('\r\n\r\n')
          .filter((x) => x.trim() !== '');
        const indexOfIC = tables?.findIndex((x) =>
          x.includes('Information Contacts....'),
        );
        tables = tables?.slice(indexOfIC + 1);
        const lastIndexOdIc = tables?.findIndex((x) =>
          x.includes('Terms and Definitions'),
        );
        tables = tables?.slice(0, lastIndexOdIc);

        // ok now we need to loop through each tocData and find the index of the tocData in the tables
        const objTocItems = {};
        tocData?.forEach((tocItem, index) => {
          const indexOfToc = tables.findIndex((x) => x.includes(tocItem));
          const nextTocItem = tocData[index + 1];
          const nextIndexOfToc = tables.findIndex((x) =>
            x.includes(nextTocItem),
          );

          objTocItems[tocItem] = tables.slice(indexOfToc, nextIndexOfToc);
        });

        const extracted = {
          date: new Date(
            summaryPage
              .match(/Released\s([A-Za-z]+\s\d{1,2},\s\d{4})/gm)[0]
              .split('Released ')[1],
          ),
          tocData,
          objTocItems,
          summaryPage,
        };

        report.generated.lstk.extracted = extracted;

        await this.usdaModel.findOneAndUpdate(
          { _id: report._id },
          {
            $set: {
              'generated.lstk.extracted': extracted,
            },
          },
          { new: true },
        );

        results.push(extracted);
      } catch (e) {
        console.error(e);
        continue;
      }
    }
    return results;
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

  async analyze(
    owner: string,
    type: USDA_REPORT_TYPES_ENUM = USDA_REPORT_TYPES_ENUM.LIVESTOCK,
  ) {
    const steps = [
      {
        role: 'user',
        content: 'Writing the report now.',
      },
      {
        role: 'user',
        content: 'Analyzing the report now.',
      },
      {
        role: 'user',
        content: 'Generating a summary of the report now.',
      },
    ];

    if (type === USDA_REPORT_TYPES_ENUM.LIVESTOCK) {
      const allLstk = await this.usdaModel.find({
        reportType: USDA_REPORT_TYPES_ENUM.LIVESTOCK,
      });

      // loop through all the livestock slaughter reports and analyze them

      // run the AI logic on the report

      const all = [];
      for (let i = 0; i < allLstk.length; i++) {
        const report = allLstk[i];

        if (
          report.generated.lstk &&
          report.generated.lstk.commercial_red_meat_production_structured
        )
          continue;
      }

      return all;
    }

    return [];
  }

  // CRONS Below
  async runAILogicOnUsdaReport(
    owner: string,
    type: USDA_REPORT_TYPES_ENUM = USDA_REPORT_TYPES_ENUM.LIVESTOCK,
  ) {
    const messages2 = [
      {
        role: 'assistant',
        content: 'Writing the report now.',
      },
    ];

    if (type === USDA_REPORT_TYPES_ENUM.LIVESTOCK) {
      const allLstk = await this.usdaModel.find({
        reportType: USDA_REPORT_TYPES_ENUM.LIVESTOCK,
      });

      // loop through all the livestock slaughter reports and analyze them

      // run the AI logic on the report

      const all = [];
      for (let i = 0; i < allLstk.length; i++) {
        const report = allLstk[i];

        if (
          report.generated.lstk &&
          report.generated.lstk.commercial_red_meat_production_structured
        )
          continue;
        // if we already have a generated livestock report, ski
        let d: any = await this.openAiService.runSingleCall(
          analyze_livestock_slaughter_report(report.fullText),
          messages2,
          owner,
          {
            mode: 'json',
          },
        );

        const textVal = d.data[0].content[0].text.value;
        console.log(textVal);
        try {
          d = JSON.parse(textVal);
        } catch (e) {
          console.error(e);
          continue;
        }
        const updated = await this.usdaModel.findOneAndUpdate(
          { _id: report._id },
          {
            $set: {
              'generated.lstk': d,
            },
          },
          { new: true },
        );

        // not saving above?

        await updated.save();
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

  async buildCommands<T>(properties: T) {
    try {
      // High Level Design:
      const analysis_command_schemas = Object.keys(properties).map((key) => {
        return {
          $schema: 'http://json-schema.org/draft-07/schema#',
          ...properties[key],
        };
      });

      return analysis_command_schemas;
    } catch (error) {
      console.error('Error running chain on report:', error);
      return { error: 'Failed to run the chain on the report' };
    }
  }

  async runChainOfCommandsOnUsdaReport(
    owner: string,
    type: USDA_REPORT_TYPES_ENUM = USDA_REPORT_TYPES_ENUM.LIVESTOCK,
  ) {
    const steps = [];

    if (type === USDA_REPORT_TYPES_ENUM.LIVESTOCK) {
      const allLstk = await this.usdaModel.find({
        reportType: USDA_REPORT_TYPES_ENUM.LIVESTOCK,
      });

      // loop through all the livestock slaughter reports and analyze them

      // run the AI logic on the report

      const all = [];
      const commands = await this.buildCommands<
        typeof livestock_slaughter_report_json_schema.properties
      >(livestock_slaughter_report_json_schema.properties);

      for (let i = 0; i < allLstk.length; i++) {
        const report = allLstk[i];
        const system = `

        Task: 
        Respond in JSON format with the following metrics in the schema below.
        Focus on the key data points and provide a structured response.
        You can use the data in the report to calculate the numbers.
        When numbers are mentioned, you must supply the full and complete number you need to infer the number from the context. 
        If the description tells you how to calculate the number, you must provide the number and the calculation.

        Report: ${report.fullText}

        `;

        const callback = async (d) => {
          console.log(d);
          const updated = await this.usdaModel.findOneAndUpdate(
            { _id: report._id },
            {
              $set: {
                'generated.lstk': {
                  ...report.generated.lstk,
                  ...d,
                },
              },
            },
            { new: true },
          );

          console.log('Updated');
        };

        const d: any = await this.openAiService.runLoopOfCAnalysisCommands(
          system,
          commands, // we need to ensure only the commands that we have not run are run
          owner,
          // Callback for each property
          callback,
          (command) =>
            `
          You are going to be extracting information from the USDA report.
          Be throrough and ensure you extract all the information as request by the schema provided below.

          Extract the information in the report following the schema below:
          ${JSON.stringify(command, null, 2)}
          `,
          {
            mode: 'json',
          },
        );
      }

      return all;
    }

    return [];
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

          const foundReport = await this.usdaModel.findOne({
            textLink: txtLinks[i],
            pdfLink: pdfLinks[i],
          });

          if (foundReport) {
            continue;
          }

          const response = await fetch(txtLinks[i]);
          const data = await response.text();

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

  async historicalGetSlaughterDataByState() {
    // implement this as aggregation
    const allReports = await this.usdaModel
      .aggregate([
        {
          $unwind: '$generated.lstk.cattleSlaughterDataByState.states',
        },
        {
          $project: {
            _id: 0,
            state: '$generated.lstk.cattleSlaughterDataByState.states.state',
            total_head_slaughtered: {
              $multiply: [
                '$generated.lstk.cattleSlaughterDataByState.states.total_head_slaughtered',
                1000,
              ],
            },
            average_live_weight:
              '$generated.lstk.cattleSlaughterDataByState.states.average_live_weight',
            total_live_weight: {
              $replaceOne: {
                input: {
                  $toString:
                    '$generated.lstk.cattleSlaughterDataByState.states.total_live_weight',
                },
                find: '.',
                replacement: '',
              },
            },
            date: '$generated.lstk.totalHeadSlaughtered.date',
          },
        },
        {
          $project: {
            _id: 0,
            date: '$date',
            state: '$state',
            total_head_slaughtered: '$total_head_slaughtered',
            average_live_weight: '$average_live_weight',
            total_live_weight: {
              $toInt: '$total_live_weight',
            },
          },
        },
        {
          $project: {
            _id: 0,
            date: '$date',
            state: '$state',
            total_head_slaughtered: '$total_head_slaughtered',
            average_live_weight: '$average_live_weight',
            total_live_weight: {
              $multiply: ['$total_live_weight', 1],
            },
          },
        },
        {
          $group: {
            _id: '$date',

            states_data: {
              $push: {
                state: '$state',
                total_head_slaughtered: '$total_head_slaughtered',
                average_live_weight: '$average_live_weight',
                total_live_weight: '$total_live_weight',
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            date: '$_id',
            total_head_slaughtered: 1,
            average_live_weight: 1,

            states_data: 1,
          },
        },
        {
          $sort: {
            date: -1,
          },
        },
      ])
      .exec();

    return allReports;
  }

  async uniqueKeysForReportsTypes() {
    // we need to do the aggregation to get the unique keys for the reports

    const uniqueKeys = await this.usdaModel.aggregate([
      {
        $match: {
          reportType: 'LIVESTOCK',
        },
      },
      {
        $project: {
          keys: {
            $objectToArray: '$generated.lstk.extracted.objTocItems',
          },
        },
      },
      {
        $unwind: '$keys',
      },
      {
        $project: {
          splitKeys: {
            $arrayElemAt: [
              {
                $split: ['$keys.k', ':'],
              },
              0,
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          uniqueKeys: {
            $addToSet: '$splitKeys',
          },
        },
      },
      {
        $project: {
          uniqueKeys: 1,
          _id: 0,
        },
      },
    ]);

    return (uniqueKeys as any).uniqueKeys;
  }
}
