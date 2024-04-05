import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MediaDocument = Media & Document;

@Schema()
export class Media extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  url: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: false })
  size: number;

  @Prop({ required: false })
  blob: Buffer;

  @Prop({ required: true })
  s3_key: string;

  // Add more properties as needed

  // You can also define methods and statics here

  // Example method
  public getFormattedUrl(): string {
    // Add your logic here
    return this.url.toUpperCase();
  }
}

export const MediaSchema = SchemaFactory.createForClass(Media);
