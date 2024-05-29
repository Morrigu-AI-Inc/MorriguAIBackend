import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from 'src/db/schemas/Product';
import { Supplier } from 'src/db/schemas/Supplier';

// @Prop({ required: true })
// name: string;

// @Prop({ required: true })
// description: string;

// @Prop({ required: true })
// price: number;

// @Prop({ required: true })
// category: string;

// @Prop([{ type: Types.ObjectId, ref: 'Tag' }])
// tags: Types.ObjectId[]; // Assumes a Tag schema exists for tagging the product

// @Prop({ required: false, default: 0})
// stock: number;

// @Prop([{ type: Types.ObjectId, ref: 'Review' }])
// reviews: Types.ObjectId[]; // Assumes a Review schema exists for product reviews

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
      console.log(createProductDto);
      const suppliers = await this.supplierModel.findOne({
        _id: {
          $in: [supplier],
        },
      });

      if (!suppliers) {
        throw new Error('Supplier not found');
      }

      const products = await this.productModel.insertMany(
        createProductDto.map((product) => {
          return {
            ...product,
            description: product.description || ' ',
            price: product.price || 0,
            category: ' ',
            supplier: suppliers._id,
          };
        }),
      );

      if (!products) {
        throw new Error('Error creating products');
      }

      suppliers.products = products;

      await suppliers.save();

      return products;
    } catch (error) {
      console.log('Error creating products:', error);
      return error;
    }
  }

  async findAll(supplier: string) {
    console.log('SUPPLIER: ', supplier);
    return await this.productModel.find({
      // weird
      supplier: new Types.ObjectId(supplier),
    }).limit(10);
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
