import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  IndividualNotification,
  NotificationDocument,
  OrganizationNotification,
  SystemNotification,
} from 'src/db/schemas/Notification';
import { Model } from 'mongoose';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notification')
    private notificationModel: Model<Notification>,

    @InjectModel('SystemNotification')
    private systemNotificationModel: Model<SystemNotification>,

    @InjectModel('IndividualNotification')
    private individualNotificationModel: Model<IndividualNotification>,

    @InjectModel('OrganizationNotification')
    private organizationNotificationModel: Model<OrganizationNotification>,
  ) {}

  create(createNotificationDto: CreateNotificationDto) {
    const notification = new this.notificationModel(createNotificationDto);

    return notification.save();
  }

  findAll() {
    const notifications = this.notificationModel.find();

    return notifications;
  }

  findOne(id: string) {
    const notification = this.notificationModel.findById(id);

    return notification;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    const notification = this.notificationModel.findByIdAndUpdate(
      id,
      updateNotificationDto,
    );

    return notification;
  }

  remove(id: number) {
    const notification = this.notificationModel.findByIdAndDelete(id);
  }

  createSystemNotification(createNotificationDto: CreateNotificationDto) {
    const systemNotification = new this.systemNotificationModel(
      createNotificationDto,
    );

    return systemNotification.save();
  }

  createIndividualNotification(createNotificationDto: CreateNotificationDto) {
    const individualNotification = new this.individualNotificationModel(
      createNotificationDto,
    );

    return individualNotification.save();
  }

  createOrganizationNotification(createNotificationDto: CreateNotificationDto) {
    const organizationNotification = new this.organizationNotificationModel(
      createNotificationDto,
    );

    return organizationNotification.save();
  }

  findAllSystemNotification() {
    return this.systemNotificationModel.find();
  }

  findAllIndividualNotification() {
    return this.individualNotificationModel.find();
  }

  findAllOrganizationNotification() {
    return this.organizationNotificationModel.find();
  }

  findOneSystemNotification(id: string) {
    return this.systemNotificationModel.findById(id);
  }
}
