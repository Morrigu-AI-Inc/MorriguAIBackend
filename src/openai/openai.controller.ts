import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Query,
  Req,
  Sse,
} from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { Observable } from 'rxjs';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Get('/assistant/thread')
  async createThread() {
    try {
      return await this.openaiService.getNewThread();
    } catch (error) {
      console.error('Error creating thread', error);
    }
  }

  @Get('/assistant/thread/:threadId/messages')
  async getMessages(@Param('threadId') threadId: string) {
    try {
      return await this.openaiService.getMessages(threadId);
    } catch (error) {
      console.error('Error getting messages', error);
    }
  }

  @Post('/assistant/thread/:threadId/message')
  async addMessageToThread(
    @Param('threadId') threadId: string,
    @Body()
    message: {
      role: string;
      content: string;
    },
  ) {
    try {
      return await this.openaiService.addMessageToThread(
        threadId,
        message.content,
      );
    } catch (error) {
      console.error('Error adding message to thread', error);
    }
  }

  @Sse('/assistant/thread/:threadId')
  @Get('/assistant/thread/:threadId')
  @Header('Content-Type', 'text/event-stream')
  @Header('Cache-Control', 'no-cache, no-transform')
  @Header('Content-Encoding', 'none')
  @Header('Transfer-Encoding', 'chunked')
  async getThread(
    @Param('threadId') threadId: string,
    @Req() req,
    @Query('token') token,
  ) {
    //add message to thread
    console.log('req', token);
    try {
      const [observer, sub] = await this.openaiService.runAssistant(
        threadId,
        token,
      );

      return observer;
    } catch (error) {
      console.error('Error adding message to thread', error);
    }
  }
}
