import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDeltaDocument = MessageDelta & Document;

@Schema()
class ImageFile {
  @Prop({ required: true })
  index: number;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  file_id: string;

  @Prop()
  detail: string;
}

@Schema()
class TextContent {
  @Prop({ required: true })
  index: number;

  @Prop({ required: true })
  type: string;

  @Prop({
    type: {
      value: String,
      annotations: [{ type: Types.ObjectId, ref: 'Annotation' }],
    },
    required: true,
  })
  text: {
    value: string;
    annotations: Types.ObjectId[];
  };
}

@Schema()
class FileCitation {
  @Prop({ required: true })
  index: number;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  text: string;

  @Prop({
    type: {
      file_id: String,
      quote: String,
      start_index: Number,
      end_index: Number,
    },
    required: true,
  })
  file_citation: {
    file_id: string;
    quote: string;
    start_index: number;
    end_index: number;
  };
}

@Schema()
class FilePath {
  @Prop({ required: true })
  index: number;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  text: string;

  @Prop({
    type: {
      file_id: String,
      start_index: Number,
      end_index: Number,
    },
    required: true,
  })
  file_path: {
    file_id: string;
    start_index: number;
    end_index: number;
  };
}

@Schema()
class ImageURL {
  @Prop({ required: true })
  index: number;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  url: string;

  @Prop()
  detail: string;
}

@Schema()
class DeltaContent {
  @Prop({ type: Types.ObjectId, refPath: 'contentType' })
  content: Types.ObjectId;

  @Prop({
    required: true,
    enum: ['text', 'image_file', 'file_citation', 'file_path', 'image_url'],
  })
  contentType: string;
}

@Schema()
class Delta {
  @Prop([{ type: Types.ObjectId, ref: 'DeltaContent' }])
  content: DeltaContent[];
}

@Schema({
  timestamps: true,
  versionKey: 'version',
})
export class MessageDelta extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  object: string;

  @Prop({ type: Types.ObjectId, ref: 'Delta' })
  delta: Delta;
}

const MessageDeltaSchema = SchemaFactory.createForClass(MessageDelta);
const ImageFileSchema = SchemaFactory.createForClass(ImageFile);
const TextContentSchema = SchemaFactory.createForClass(TextContent);
const FileCitationSchema = SchemaFactory.createForClass(FileCitation);
const FilePathSchema = SchemaFactory.createForClass(FilePath);
const ImageURLSchema = SchemaFactory.createForClass(ImageURL);
const DeltaContentSchema = SchemaFactory.createForClass(DeltaContent);
const DeltaSchema = SchemaFactory.createForClass(Delta);

export {
  MessageDeltaSchema,
  ImageFileSchema,
  TextContentSchema,
  FileCitationSchema,
  FilePathSchema,
  ImageURLSchema,
  DeltaContentSchema,
  DeltaSchema,
};

export const messageDeltaModules = [
  MongooseModule.forFeature([
    { name: 'MessageDelta', schema: MessageDeltaSchema },
    { name: 'ImageFile', schema: ImageFileSchema },
    { name: 'TextContent', schema: TextContentSchema },
    { name: 'FileCitation', schema: FileCitationSchema },
    { name: 'FilePath', schema: FilePathSchema },
    { name: 'ImageURL', schema: ImageURLSchema },
    { name: 'DeltaContent', schema: DeltaContentSchema },
    { name: 'Delta', schema: DeltaSchema },
  ]),
];

export default MessageDeltaSchema;
