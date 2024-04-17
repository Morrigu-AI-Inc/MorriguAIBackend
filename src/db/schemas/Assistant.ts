// The assistant is a reference to the OpenAI assistant and the primary reason we are storing some of the config here is
// to ensure that the assistant can be easily accessed from anywhere in the app. This is important because the assistant
// is used in many places and we want to ensure that the assistant is easily accessible.

// The information this mongoose model will store is the assistant_id and the assistant object itself.
// The assistant_id is the external id of the assistant and is used to identify the assistant in the database.
// The assistant object is the actual assistant object that contains all the information about the assistant.

// The assistant object contains the following information:
// - id: The id of the assistant
// - name: The name of the assistant
// - description: The description of the assistant
// - config: The configuration of the assistant
// - status: The status of the assistant
// - owner: The owner of the assistant
// - organization: The organization the assistant belongs to

// we are going to build assistant that can tackle various API integrations, data transformations, and other tasks.
// We will intelligently swift from assistant to assistant to get the job done.
// This will allow us to build a powerful assistant. This is mainly due to how we are building the api integrations.

// We are creating large large schema files to guide the assistant on how to interact with the various APIs.
// nestjs

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type AssistantDocument = Assistant & Document;

@Schema({ timestamps: true, versionKey: false, collection: 'assistants' })
export class Assistant {
  @Prop({ type: SchemaTypes.Mixed, required: true })
  assistant_id: string;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  assistant: any;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  organization: string;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  owner: string;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  status: string;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  config: any;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  description: string;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  name: string;

  @Prop({ type: SchemaTypes.Mixed, required: true })
  tools: any[];
}

export const AssistantSchema = SchemaFactory.createForClass(Assistant);
