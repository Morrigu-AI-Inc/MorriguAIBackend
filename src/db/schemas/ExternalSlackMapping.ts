import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExternalSlackMappingDocument = ExternalSlackMapping & Document;

@Schema()
export class ExternalSlackMapping extends Document {
  @Prop({ type: Object, required: true })
  channel: object;

  @Prop({ required: true, type: String })
  channelId: string;

  @Prop({ required: true, type: String })
  threadId: string;

  @Prop({ required: true, type: String })
  slackUserId: string;
}

export const ExternalSlackMappingSchema =
  SchemaFactory.createForClass(ExternalSlackMapping);
