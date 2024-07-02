import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from 'src/db/schemas/Product';
import { Supplier } from 'src/db/schemas/Supplier';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
    @InjectModel('Supplier') private readonly supplierModel: Model<Supplier>,
  ) {}

  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  async createBulk(createProductDto: CreateProductDto[], supplier: string) {
    try {
      if (!Types.ObjectId.isValid(supplier)) {
        throw new Error('Invalid Supplier ID');
      }

      const supplierId = new Types.ObjectId(supplier);
      const supplierDoc = await this.supplierModel.findById(supplierId);

      if (!supplierDoc) {
        throw new Error('Supplier not found');
      }

      const products = await this.productModel.insertMany(
        createProductDto.map((product) => ({
          ...product,
          description: product.description || ' ',
          price: product.price || 0,
          category: ' ',
          supplier: supplierDoc._id,
        })),
      );

      if (!products) {
        throw new Error('Error creating products');
      }

      supplierDoc.products = products.map((product) => product._id);
      await supplierDoc.save();

      return products;
    } catch (error) {
      console.error('Error creating products:', error.message);
      throw error;
    }
  }

  async findAll(supplier: string) {
    try {
      console.log('supplier', supplier);
      if (!Types.ObjectId.isValid(supplier)) {
        return []
      }

      const supplierId = new Types.ObjectId(supplier);
      return await this.productModel.find({ supplier: supplierId }).limit(10);
    } catch (error) {
      console.error('Error finding products:', error.message);
      throw error;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
