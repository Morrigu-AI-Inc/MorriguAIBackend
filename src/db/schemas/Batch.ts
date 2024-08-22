// src/batch/schemas/batch.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BatchDocument = Batch & Document;

@Schema()
export class Batch {
  @Prop({ required: false })
  batchResponseId: string;

  @Prop({ required: true })
  inputData: string; // Store the JSONL data as a string

  @Prop()
  outputData: string;

  @Prop({ required: true })
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  errorMessage: string;
}

export const BatchSchema = SchemaFactory.createForClass(Batch);
