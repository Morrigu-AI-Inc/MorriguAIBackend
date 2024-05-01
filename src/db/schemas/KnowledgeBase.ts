import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type KnowledgeBaseDocument = KnowledgeBase & Document;
function metadataLimit(metadata: Map<string, string>): boolean {
  if (metadata.size > 16) return false;
  for (const [key, value] of metadata) {
    if (key.length > 64 || value.length > 512) return false;
  }
  return true;
}

@Schema({ timestamps: true })
export class KnowledgeBase {
  @Prop({ required: true })
  store_id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [String], required: false })
  file_ids: string[];

  @Prop({
    type: {
      anchor: { type: String, enum: ['last_active_at'], required: false },
      days: { type: Number, required: false },
    },
    required: false,
  })
  expires_after: {
    anchor: string;
    days: number;
  };

  @Prop({
    type: Map,
    of: String,
    validate: [
      metadataLimit,
      'Metadata exceeds the limit of 16 key-value pairs',
    ],
  })
  metadata: Map<string, string>;

  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  owner: Types.ObjectId;

  // Additional utility method to validate metadata constraints
}

export const KnowledgeBaseSchema = SchemaFactory.createForClass(KnowledgeBase);
