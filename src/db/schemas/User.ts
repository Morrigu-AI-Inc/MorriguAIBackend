import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true, collection: 'users'})
export class User {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  provider: string;

  @Prop({ required: false, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: SchemaTypes.Mixed })
  data: unknown;
}

export const UserSchema = SchemaFactory.createForClass(User);
