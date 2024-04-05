import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ToolDocument = ToolDescription & Document;

@Schema({ timestamps: true, collection: 'tool_descriptions' })
export class ToolDescription {
  @Prop({ type: String, required: true })
  tool_name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Array<object>, required: true })
  parameters: Array<{
    name: string;
    type: string;
    description: string;
  }>;
}

export const ToolDescriptionSchema =
  SchemaFactory.createForClass(ToolDescription);
