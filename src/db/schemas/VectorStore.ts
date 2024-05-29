import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BaseDocument } from './BaseDocument';
import { Organization } from './Organization';

export type VectorStoreDocument = VectorStore & Document;

@Schema({
  timestamps: true,
  versionKey: 'version',
})
export class VectorStore extends Document {
  @Prop({ type: String, required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [String], required: true })
  file_ids: string[];

  @Prop({ type: Number, default: 0 })
  file_count: number;

  @Prop({ type: Date, default: null })
  expires_after: Date;

  @Prop({ type: [Types.ObjectId], ref: 'Assistant', default: [] })
  attached_assistants: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Thread', default: [] })
  attached_threads: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  owner: Organization;
}

export const VectorStoreSchema = SchemaFactory.createForClass(VectorStore);

export default VectorStoreSchema;
