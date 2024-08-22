import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ObjectmatcherService } from './objectmatcher.service';
import { CreateObjectmatcherDto } from './dto/create-objectmatcher.dto';
import { UpdateObjectmatcherDto } from './dto/update-objectmatcher.dto';

@Controller('objectwatcher')
export class ObjectmatcherController {
  constructor(private readonly objectWatcherService: ObjectmatcherService) {}

  @Post()
  create(@Body() createObjectmatcherDto: CreateObjectmatcherDto) {
    return this.objectWatcherService.create(createObjectmatcherDto);
  }

  @Get()
  findAll(@Query('owner') owner: string, @Query('watchType') type: string) {
    console.log('owner', owner);
    console.log('type', type);
    return this.objectWatcherService.findAll(owner, type);
  }
}
