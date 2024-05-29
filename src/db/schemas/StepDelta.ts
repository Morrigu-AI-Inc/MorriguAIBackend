import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StepDeltaDocument = StepDelta & Document;

@Schema({
  timestamps: false,
  versionKey: false,
})
export class StepDelta extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  object: string;

  @Prop({
    type: {
      step_details: {
        type: { type: String },
        message_creation: {
          type: {
            message_id: { type: String },
          },
          required: false,
        },
        tool_calls: [
          {
            index: { type: Number },
            id: { type: String },
            type: { type: String },
            code_interpreter: {
              input: { type: String },
              outputs: [
                {
                  index: { type: Number },
                  type: { type: String },
                  logs: { type: String },
                },
              ],
            },
            file_search: {
              type: Map,
              of: String,
              default: {},
            },
            function: {
              name: { type: String },
              arguments: { type: String },
              output: { type: String, default: null },
            },
          },
        ],
      },
    },
  })
  delta: {
    step_details: {
      type: string;
      message_creation?: {
        message_id: string;
      };
      tool_calls?: {
        index: number;
        id: string;
        type: string;
        code_interpreter?: {
          input: string;
          outputs: Array<{
            index: number;
            type: string;
            logs: string;
          }>;
        };
        file_search?: Record<string, any>;
        function?: {
          name: string;
          arguments: string;
          output: string | null;
        };
      }[];
    };
  };
}

const StepDeltaSchema = SchemaFactory.createForClass(StepDelta);

export default StepDeltaSchema;
