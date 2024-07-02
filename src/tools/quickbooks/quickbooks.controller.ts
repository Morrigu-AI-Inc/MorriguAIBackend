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

@Controller('tools/quickbooks')
export class QuickbooksController {
  constructor(private readonly quickbooksService: QuickbooksService) {}

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
    console.log('body', req);
    console.log('headers', headers);
    console.log('queryParameters', queryParameters);

    // const results = await fetch(
    //   `${process.env.PARAGON_URL}/sdk/proxy/quickbooks/ `,
    //   {
    //     method: 'GET',
    //     headers: {
    //       Authorization: headers.authorization.includes('Bearer')
    //         ? headers.authorization
    //         : `Bearer ${headers.authorization}`,
    //       'Content-Type': 'application/json',
    //     },
    //   },
    // );

    return JSON.stringify({
      message: 'Querying Quickbooks',
      req,
      headers,
      queryParameters,
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
