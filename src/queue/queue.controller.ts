import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QueueService } from './queue.service';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
import { BullJobNames, BullQueues } from './entities/queue.entity';

@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  // add job 
  // async addJob(data: any, queue: BullQueues, job: BullJobNames) {

  //   if(!this.queues[queue]) {
  //     throw new Error(`Queue ${queue} not found`);
  //   }

  //   if(!this.queues[queue].jobs[job]) {
  //     throw new Error(`Job ${job} not found in queue ${queue}`);
  //   }

  //   await this.queues[queue].jobs[job].queue.add(job, data);
  // }
  @Post(':queue/:job')
  async addJob(@Body() data: any, @Param('queue') queue: BullQueues, @Param('job') job: BullJobNames) {
    return this.queueService.addJob(data, queue, job);
  }

}
