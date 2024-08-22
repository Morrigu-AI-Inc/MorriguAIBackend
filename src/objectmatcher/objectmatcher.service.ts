import { Injectable } from '@nestjs/common';
import { CreateObjectmatcherDto } from './dto/create-objectmatcher.dto';
import { UpdateObjectmatcherDto } from './dto/update-objectmatcher.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectWatcher } from 'src/db/schemas/ObjectWatcher';
import { Model } from 'mongoose';
import { User } from 'src/db/schemas';

@Injectable()
export class ObjectmatcherService {
  constructor(
    @InjectModel('ObjectWatcher')
    private objectWatcherModel: Model<ObjectWatcher>,

    @InjectModel('User')
    private userModel: Model<User>,
  ) {}

  async create(createObjectmatcherDto: CreateObjectmatcherDto) {
    const user = this.userModel.findById({
      id: createObjectmatcherDto.owner,
    });

    if (!user) {
      throw new Error('User not found');
    }

    const foundWatchers = await this.objectWatcherModel.find({
      watchCodes: {
        $in: createObjectmatcherDto.watchCodes,
      },
      userId: createObjectmatcherDto.owner,
    });

    let codes = createObjectmatcherDto.watchCodes

    if (foundWatchers) {
      codes = createObjectmatcherDto.watchCodes.filter(
        (code) => !foundWatchers.some((watcher) => watcher.watchCode === code),
      );
    }

    const bulks = [];

    if (!codes || codes.length === 0) {
      throw new Error('Watch codes are required');
    }

    if (!createObjectmatcherDto.type) {
      throw new Error('Watch type is required');
    }

    for (let code of codes) {
      bulks.push({
        watchCode: code,
        watchType: createObjectmatcherDto.type,
        notificationType: createObjectmatcherDto.notificationType,
        userId: createObjectmatcherDto.owner,
      });
    }

    return this.objectWatcherModel.insertMany(bulks)
  }

  async findAll(owner, type) {
    console.log(owner, type);
    return this.objectWatcherModel.find({
      userId: owner,
      watchType: type,
    });
  }
}
