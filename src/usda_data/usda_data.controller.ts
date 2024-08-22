import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { USDA_REPORT_TYPES_ENUM, UsdaDataService } from './usda_data.service';
import { CreateUsdaDatumDto } from './dto/create-usda_datum.dto';
import { UpdateUsdaDatumDto } from './dto/update-usda_datum.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { livestock_slaughter_report_json_schema } from './entities/usda_analyze_prompt_commands';
import OpenAI from 'openai';


@Controller('usda-data')
export class UsdaDataController {
  constructor(private readonly usdaDataService: UsdaDataService) {}

  @Get()
  async getAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.usdaDataService.findAll(page, limit);
  }

  @Cron(CronExpression.EVERY_DAY_AT_1PM)
  @Get('scrape')
  async scrape() {
    await this.usdaDataService.scrapeUsdaData();

    return [];
  }

  @Get('analyze')
  async analyze(
    @Query('owner') owner: string,
    @Query('type')
    type: USDA_REPORT_TYPES_ENUM = USDA_REPORT_TYPES_ENUM.LIVESTOCK,
  ) {
    // await this.usdaDataService.scrapeUsdaData();

    // const idk = await this.usdaDataService.runChainOfCommandsOnUsdaReport(
    //   owner,
    //   type,
    // );

    const openai = new OpenAI();
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: ``,
        },
        { role: 'assistant', content: 'Extracting' },
      ],
      model: 'gpt-4o',
      response_format: {
        type: 'json_object',
      },
      max_tokens: Infinity,
    });

    console.log(JSON.parse(completion.choices[0].message.content));

    // await this.usdaDataService.SplitReportsOnToC();
    // await this.usdaDataService.matchPartsToSchema();
    // await this.usdaDataService.buildTableCommands();
    await this.usdaDataService.runCommands(owner);
    // return idk2;
    // const list = await this.usdaDataService.runAILogicOnUsdaReport(owner, type);
    // return list;
  }

  @Get('/historicalGetSlaughterDataByState')
  async historicalGetSlaughterDataByState() {
    try {
      return await this.usdaDataService.historicalGetSlaughterDataByState();
    } catch (error) {
      return error;
    }
  }

  @Get('/:slug')
  async getOne(@Param('slug') slug: string) {
    return this.usdaDataService.findBySlug(slug);
  }
}
