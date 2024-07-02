import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { GenerativeService } from './generative.service';
import { CreateGenerativeDto } from './dto/create-generative.dto';
import { UpdateGenerativeDto } from './dto/update-generative.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from 'src/media/media.service';
import { User, UserDocument } from 'src/db/schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import OpenAI from 'openai';
import { MessageDocument } from 'src/db/schemas/Message';

@Controller('generative')
export class GenerativeController {
  private openai: OpenAI;
  constructor(
    private readonly generativeService: GenerativeService,
    private readonly mediaService: MediaService,
    @InjectModel('User') private userModel: Model<UserDocument>,
    @InjectModel('Message') private messageModel: Model<MessageDocument>,
  ) {}

  @Post()
  create(@Body() createGenerativeDto: CreateGenerativeDto) {
    return this.generativeService.create(createGenerativeDto);
  }

  @Get()
  findAll() {
    return this.generativeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.generativeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGenerativeDto: UpdateGenerativeDto,
  ) {
    return this.generativeService.update(+id, updateGenerativeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.generativeService.remove(+id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileToVectorStore(@Body() file: any) {
    try {
      return this.mediaService.uploadFile(file);
    } catch (error) {
      return error;
    }
  }

  @Get('thread/:id')
  async getThread(@Param('id') id: string) {
    return await this.generativeService.getThread(id);
  }

  @Post('thread')
  async createThread(
    @Body()
    {
      owner,
      alternate_instructions,
    }: {
      owner: string;
      alternate_instructions: string;
    },
  ) {
    //
    //
    const user = await this.userModel.findOne({ id: owner });

    //

    const thrd = await this.generativeService.createThread(
      user,
      alternate_instructions,
    );

    //

    return thrd;
  }

  @Post('/:assistant_id/:threadId/message')
  @UseInterceptors(FileInterceptor('file'))
  async createMessage(
    @UploadedFile() file,
    @Param('assistant_id') assistantId: string,
    @Param('threadId') threadId: string,
    @Body('text') text: string,
    @Body('alternateInstruction') alternateInstruction: string,
  ) {
    // here well want to init a new OpenAI Client
    return await this.generativeService.createMessage(
      assistantId,
      threadId,
      text,
      file
        ? [file, await this.mediaService.uploadFile(file)]
        : [undefined, undefined],
      alternateInstruction,
    );
  }
}
