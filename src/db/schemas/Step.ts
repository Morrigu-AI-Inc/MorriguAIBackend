import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type RunStepDocument = RunStep & Document;

@Schema({
  timestamps: false,
  versionKey: false,
})
class ToolFunction {
  @Prop()
  name: string;

  @Prop()
  arguments: string;

  @Prop({ default: null })
  output: string | null;

  @Prop({ type: { code: String, message: String } })
  last_error: {
    code: string;
    message: string;
  };
}

@Schema({
  timestamps: false,
  versionKey: false,
})
class ToolCall {
  @Prop()
  id: string;

  @Prop()
  type: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  code_interpreter: Record<string, unknown>;

  @Prop({ type: MongooseSchema.Types.Mixed })
  file_search: Record<string, unknown>;

  @Prop({ type: ToolFunction })
  function: ToolFunction;
}

@Schema({
  timestamps: false,
  versionKey: false,
})
class MessageCreation {
  @Prop()
  message_id: string;
}

@Schema({
  timestamps: false,
  versionKey: false,
})
class StepDetails {
  @Prop({ required: true })
  type: string;

  @Prop({ type: MessageCreation })
  message_creation?: MessageCreation;

  @Prop({ type: [ToolCall] })
  tool_calls?: ToolCall[];
}

@Schema({
  timestamps: false,
  versionKey: false,
})
class Usage {
  @Prop()
  prompt_tokens: number;

  @Prop()
  completion_tokens: number;

  @Prop()
  total_tokens: number;
}

const ToolFunctionSchema = SchemaFactory.createForClass(ToolFunction);
const ToolCallSchema = SchemaFactory.createForClass(ToolCall);
const MessageCreationSchema = SchemaFactory.createForClass(MessageCreation);
const StepDetailsSchema = SchemaFactory.createForClass(StepDetails);
const UsageSchema = SchemaFactory.createForClass(Usage);

@Schema({
  timestamps: false,
  versionKey: false,
})
export class RunStep extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  object: string;

  @Prop({ required: true })
  created_at: number;

  @Prop({ required: true })
  run_id: string;

  @Prop({ required: true })
  assistant_id: string;

  @Prop({ required: true })
  thread_id: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  status: string;

  @Prop({ type: Number, default: null })
  cancelled_at: number | null;

  @Prop({ type: Number, default: null })
  completed_at: number | null;

  @Prop({ type: Number, default: null })
  expired_at: number | null;

  @Prop({ type: Number, default: null })
  failed_at: number | null;

  @Prop({ type: StepDetailsSchema, required: true })
  step_details: StepDetails;

  @Prop({ type: UsageSchema, default: null })
  usage: Usage | null;
}

const RunStepSchema = SchemaFactory.createForClass(RunStep);

export default RunStepSchema;

export const modules = [
  MongooseModule.forFeature([
    { name: ToolFunction.name, schema: ToolFunctionSchema },
  ]),
  MongooseModule.forFeature([{ name: ToolCall.name, schema: ToolCallSchema }]),
  MongooseModule.forFeature([
    { name: MessageCreation.name, schema: MessageCreationSchema },
  ]),
  MongooseModule.forFeature([
    { name: StepDetails.name, schema: StepDetailsSchema },
  ]),
  MongooseModule.forFeature([{ name: Usage.name, schema: UsageSchema }]),
  MongooseModule.forFeature([{ name: RunStep.name, schema: RunStepSchema }]),
];
