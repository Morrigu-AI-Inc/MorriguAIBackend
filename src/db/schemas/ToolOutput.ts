import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ToolOutputDocument = ToolOutput & Document;

@Schema()
export class ToolOutput extends Document {
  @Prop({ required: true, type: String })
  runId: string;
  @Prop({ required: false, type: String, default: '' })
  msgId: string;
  @Prop({ required: true, type: Object })
  data: string;
}

export const ToolOutputSchema = SchemaFactory.createForClass(ToolOutput);
