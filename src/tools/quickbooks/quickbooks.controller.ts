import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  Query,
} from '@nestjs/common';
import { QuickbooksService } from './quickbooks.service';
import { CreateQuickbookDto } from './dto/create-quickbook.dto';
import { UpdateQuickbookDto } from './dto/update-quickbook.dto';
import { Xml2JsonServiceService } from 'src/xml2-json-service/xml2-json-service.service';
import { QuickbookQueryTool } from './entities/quickbook.entity';

@Controller('tools/quickbooks')
export class QuickbooksController {
  private tool = new QuickbookQueryTool();
  constructor(
    private readonly quickbooksService: QuickbooksService,
    private readonly xmltoJsonService: Xml2JsonServiceService,
  ) {}

  @Post()
  create(@Body() createQuickbookDto: CreateQuickbookDto) {
    return this.quickbooksService.create(createQuickbookDto);
  }

  @Get()
  async findAll(req) {
    const results = await fetch(
      `${process.env.PARAGON_URL}/sdk/proxy/quickbooks/ `,
      {
        method: 'GET',
        headers: {
          Authorization: req.headers.authorization.includes('Bearer')
            ? req.headers.authorization
            : `Bearer ${req.headers.authorization}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return this.quickbooksService.findAll();
  }

  @Get('query')
  async query(@Body() req, @Headers() headers, @Query() queryParameters) {
    
    
    

    const query = this.tool.constructQuery(queryParameters);

    const url = `${process.env.PARAGON_URL}/sdk/proxy/quickbooks/query?query=${query}`;

    const results = await fetch(`${url}`, {
      method: 'GET',
      headers: {
        Authorization: headers.authorization.includes('Bearer')
          ? headers.authorization
          : `Bearer ${headers.authorization}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(
      `querying Quickbooks with query: ${queryParameters.select_statement}`,
    );

    const output = await results.json();

    if (results.status !== 200) {
      return JSON.stringify(output);
    }

    

    return JSON.stringify({
      status: results.status,
      data: output.output,
    });

    // return this.quickbooksService.query();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quickbooksService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuickbookDto: UpdateQuickbookDto,
  ) {
    return this.quickbooksService.update(+id, updateQuickbookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quickbooksService.remove(+id);
  }
}
