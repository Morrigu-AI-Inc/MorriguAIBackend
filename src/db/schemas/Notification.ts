import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true })
  type: string; // 'System', 'Individual', 'Organization'

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  recipient: Types.ObjectId; // User receiving the notification

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  link: string; // Link to more details

  @Prop({ default: false })
  viewed: boolean;
}

@Schema()
export class SystemNotification extends Notification {
  @Prop()
  systemInfo: string; // Additional system-specific information
}

@Schema()
export class IndividualNotification extends Notification {
  @Prop()
  userId: Types.ObjectId; // User ID specific to the individual notification
}

@Schema()
export class OrganizationNotification extends Notification {
  @Prop()
  organizationId: Types.ObjectId; // Organization ID specific to the organization notification
}
export const NotificationSchema = SchemaFactory.createForClass(Notification);
export const SystemNotificationSchema =
  SchemaFactory.createForClass(SystemNotification);
export const IndividualNotificationSchema = SchemaFactory.createForClass(
  IndividualNotification,
);
export const OrganizationNotificationSchema = SchemaFactory.createForClass(
  OrganizationNotification,
);
