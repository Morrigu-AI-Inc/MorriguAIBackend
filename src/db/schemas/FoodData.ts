import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class FoodData extends Document {
  @Prop({ required: true })
  fdc_id: number;

  @Prop()
  data_type: string;

  @Prop()
  description: string;

  @Prop()
  food_category_id: number;

  @Prop()
  publication_date: Date;
}

export const FoodDataSchema = SchemaFactory.createForClass(FoodData);
