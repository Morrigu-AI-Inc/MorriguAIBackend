import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Model } from './Model';
import { User } from './User';
import { Environment } from './Environment';
import { Project } from './Project';


export type PromptDocument = Prompt & Document;

@Schema()
export class InputDocument {
  @Prop()
  name: string;

  @Prop()
  type: string;

  @Prop()
  input: string;
}

export class OutputDocument {
  @Prop()
  name: string;

  @Prop()
  type: string;

  @Prop()
  output: string;
}

@Schema({ timestamps: true })
export class Prompt {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  version: string;

  @Prop({ required: true })
  system_message: string;

  @Prop({ type: Types.ObjectId, ref: Model.name, required: true })
  modelId: Types.ObjectId;

  @Prop([{ type: Types.ObjectId, ref: 'InputDocument' }])
  inputs: Types.ObjectId[];

  @Prop([{ type: Types.ObjectId, ref: 'OutputDocument', required: true }])
  outputs: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  owner: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Environment.name, required: true })
  environment: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Project.name, required: true })
  project: Types.ObjectId;
}

export const PromptSchema = SchemaFactory.createForClass(Prompt);
