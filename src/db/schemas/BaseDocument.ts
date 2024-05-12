import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: 'version',
})
export class BaseDocument extends Document {
  @Prop({ type: Types.ObjectId, refPath: 'ownerType', required: true })
  owner: Types.ObjectId;

  @Prop({ required: true, enum: ['User', 'Organization'] })
  ownerType: string;
}

export const BaseSchema = SchemaFactory.createForClass(BaseDocument);
