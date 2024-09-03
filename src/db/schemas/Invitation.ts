import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InvitationDocument = Invitation & Document;

@Schema({ timestamps: true })
export class Invitation {
  @Prop({ required: true, trim: true })
  email: string;

  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  organization: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  invitedBy: Types.ObjectId;

  @Prop({
    required: true,
    enum: ['pending', 'accepted', 'declined', 'expired'],
    default: 'pending',
  })
  status: string;

  @Prop({ required: true, unique: true })
  invitationCode: string;

//   @Prop({ required: true })
//   expiresAt: Date;
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);
