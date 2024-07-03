import { Controller, Get, Req } from '@nestjs/common';

@Controller('tools/create_invoice')
export class CreateInvoiceController {
  constructor() {}

  @Get()
  async createInvoice(@Req() req: any) {
    console.log(req.url);
    return true;
  }
}
