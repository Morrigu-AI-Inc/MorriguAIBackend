import { Injectable } from '@nestjs/common';
import { CreateThreadDto } from './dto/create-thread.dto';
import { UpdateThreadDto } from './dto/update-thread.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import OpenAI from 'openai';
import { AssistantService } from 'src/assistant/assistant.service';
import { AssistantDocument, UserDocument } from 'src/db/schemas';
import { AttachmentDocument } from 'src/db/schemas/Attachment';
import { MessageDocument } from 'src/db/schemas/Message';
import { ThreadDocument } from 'src/db/schemas/Thread';
import { ThreadMessageDocument } from 'src/db/schemas/ThreadMessage';
import { MediaService } from 'src/media/media.service';
import { OpenaiService } from 'src/openai/openai.service';

@Injectable()
export class ThreadsService {
  private openai: OpenAI;

  constructor(
    private assistantService: AssistantService,
    private mediaService: MediaService,
    private openAiService: OpenaiService,
    @InjectModel('Assistant') private assistantModel: Model<AssistantDocument>,
    @InjectModel('Thread') private threadModel: Model<ThreadDocument>,
    @InjectModel('Message') private messageModel: Model<MessageDocument>,
    @InjectModel('User') private userModel: Model<UserDocument>,
    @InjectModel('ThreadMessage')
    private threadMessageModel: Model<ThreadMessageDocument>,
    @InjectModel('Attachment')
    private attachmentModel: Model<AttachmentDocument>,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  create(createThreadDto: CreateThreadDto) {
    return 'This action adds a new thread';
  }

  findAll() {
    return `This action returns all threads`;
  }

  findOne(id: number) {
    return `This action returns a #${id} thread`;
  }

  update(id: number, updateThreadDto: UpdateThreadDto) {
    return `This action updates a #${id} thread`;
  }

  remove(id: number) {
    return `This action removes a #${id} thread`;
  }
}
