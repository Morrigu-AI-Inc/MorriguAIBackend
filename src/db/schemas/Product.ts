import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaType, SchemaTypes, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({
  timestamps: true,
  versionKey: 'version',
})
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  category: string;

  @Prop([{ type: Types.ObjectId, ref: 'Tag' }])
  tags: Types.ObjectId[]; // Assumes a Tag schema exists for tagging the product

  @Prop({ required: false, default: 0 })
  stock: number;

  @Prop({ type: Types.ObjectId, ref: 'Supplier' })
  supplier: Types.ObjectId; // Assumes a Supplier schema exists for product suppliers

  @Prop([{ type: Types.ObjectId, ref: 'Review' }])
  reviews: Types.ObjectId[]; // Assumes a Review schema exists for product reviews

  @Prop({ type: SchemaTypes.Mixed, required: false, default: {} })
  raw: any; // For storing raw data from external APIs
}

const ProductSchema = SchemaFactory.createForClass(Product);

export default ProductSchema;
