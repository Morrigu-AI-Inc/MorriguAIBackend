import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [DbModule],
})
export class ProductModule {}
