import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PropertySchemaType = {
  type: string;
  description: string;
  enum?: [string];
};

export type InputSchemaType = {
  type: string;
  properties: Record<string, PropertySchemaType>;
  required: [string];
};

@Schema({ timestamps: true, collection: 'tool_descriptions' })
export class ToolInput extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Array<object>, required: true })
  input_schema: InputSchemaType;
}

export const ToolInputSchema = SchemaFactory.createForClass(ToolInput);
