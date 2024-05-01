import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaType, Types } from 'mongoose';

export type AgentDocument = Agent & Document;

@Schema({ timestamps: true })
export class Agent extends Document<AgentDocument> {
  @Prop({ required: true })
  agent_id: string;

  @Prop({ required: true })
  modelId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: false })
  instructions: string;

  @Prop({ required: false })
  tools: any[];

  @Prop({ required: false })
  tool_resources: object[];

  @Prop({ required: false, type: Object })
  metadata: object;

  @Prop({ required: false })
  temperature: number;

  @Prop({ required: false })
  top_p: number;

  @Prop({ required: false, type: Object })
  response_format: string | object;

  @Prop({ required: false, type: Types.ObjectId, ref: 'Organization' })
  owner: string;
}

export const AgentSchema = SchemaFactory.createForClass(Agent);
