import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class CronJob extends Document {
  @Prop({ required: true })
  jobName: string;

  @Prop({ required: true })
  runAt: Date;

  @Prop()
  status: string;

  @Prop()
  message: string;
}

export const CronJobSchema = SchemaFactory.createForClass(CronJob);
