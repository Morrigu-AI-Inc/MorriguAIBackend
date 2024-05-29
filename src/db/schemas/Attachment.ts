import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Media } from './Media';

export type AttachmentDocument = Attachment & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Attachment extends Document {
  @Prop({ required: true })
  file_id: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Media' })
  media: Media;
}

const AttachmentSchema = SchemaFactory.createForClass(Attachment);

export default AttachmentSchema;
