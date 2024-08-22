import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

interface IIngestionJob extends Document {
    url: string;
    isIngested: boolean;
}

@Schema({ timestamps: true, versionKey: false })
export class IngestionJob {
    @Prop({ required: true })
    url: string;

    @Prop({ required: true, default: false })
    isIngested: boolean;
}

export const IngestionJobSchema = SchemaFactory.createForClass(IngestionJob);

export default IngestionJob;
