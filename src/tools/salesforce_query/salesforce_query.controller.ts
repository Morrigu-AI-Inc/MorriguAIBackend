import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Query,
  Req,
} from '@nestjs/common';

@Controller('tools/salesforce_query')
export class SalesforceQueryController {
  constructor() {}

  @Get()
  async getSalesforceQuery(
    @Query('select') select: string,
    @Query('from') from: string,
    @Query('where') where: string,
    @Query('maxlimit') maxlimit: number = 100,
    @Req() req,
  ) {
    try {
      if (!select || !from) {
        throw new BadRequestException(
          'Both select and from parameters are required.',
        );
      }

      // Construct the Salesforce SQL query
      let query = `SELECT ${select} FROM ${from}`;
      if (where) {
        query += ` WHERE ${where}`;
      }
      if (maxlimit) {
        query += ` LIMIT ${maxlimit}`;
      }

      const results = await fetch(
        `${process.env.PARAGON_URL}/sdk/proxy/salesforce/query?q=${query.trim()}`,
        {
          method: 'GET',
          headers: {
            Authorization: req.headers.authorization,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!results.ok) {
        throw new NotFoundException('Failed to fetch data from Salesforce.');
      }

      const output = await results.json();
    } catch (error) {
      console.error('Error fetching data from Salesforce', error);
    }
  }
}
