import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ToolDocument = ToolDescription & Document;
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
export class ToolDescription {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Array<object>, required: true })
  input_schema: InputSchemaType;
}

export const ToolDescriptionSchema =
  SchemaFactory.createForClass(ToolDescription);
