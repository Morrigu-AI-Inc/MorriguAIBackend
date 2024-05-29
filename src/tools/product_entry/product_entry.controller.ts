import { Body, Controller, Post } from '@nestjs/common';

type CreateProductDto = any;

@Controller('tools/product_entry')
export class ProductEntryController {
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    console.log('Product created:', createProductDto);

    return {
      message: 'Product created',
      data: createProductDto,
    };
  }
}
