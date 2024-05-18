import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Organization } from './Organization';

@Schema()
export class Team extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  department: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Team' }] })
  teams: Team[];

  @Prop({ type: Types.ObjectId, ref: 'Employee' })
  lead: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Organization',
    required: true,
  })
  owner: Organization;
}

export const TeamSchema = SchemaFactory.createForClass(Team);
