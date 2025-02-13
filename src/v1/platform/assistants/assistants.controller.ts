import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Header,
  Query,
  Req,
  Sse,
  Put,
} from '@nestjs/common';
import { AssistantsService } from './assistants.service';
import { CreateAssistantDto } from './dto/create-assistant.dto';
import { UpdateAssistantDto } from './dto/update-assistant.dto';
import { AssistantParams, OpenaiService } from 'src/openai/openai.service';
import { MediaService } from 'src/media/media.service';

@Controller('v1/platform/assistants')
export class AssistantsController {
  constructor(
    private readonly openaiService: OpenaiService,
    private readonly mediaService: MediaService,
  ) {}

  @Post('/thread')
  async createThread(
    @Body() thread: {
      owner: string;
      assistant: string;
      name: string;
    },
  ) {
    try {
      return await this.openaiService.getNewThread();
    } catch (error) {
      console.error('Error creating thread', error);
    }
  }

  @Get('/thread/:threadId/messages')
  async getMessages(@Param('threadId') threadId: string) {
    try {
      return await this.openaiService.getMessages(threadId);
    } catch (error) {
      console.error('Error getting messages', error);
    }
  }

  @Get('/file/:fileId')
  async getFile(@Param('fileId') fileId: string) {
    try {
      return await this.openaiService.getFile(fileId);
    } catch (error) {
      console.error('Error getting file', error);
    }
  }

  @Post('/thread/:threadId/message')
  async addMessageToThread(
    @Param('threadId') threadId: string,
    @Body()
    message: {
      role: string;
      content: any[];
    },
  ) {
    try {
      const attachments = [];
      for (const content of message.content) {
        console.log('content', content);
        if (content.url) {
          const file = await this.openaiService.uploadBase64Image(
            content,
            'assistants',
          );

          attachments.push({
            file_id: file.id,
            tools: [{ type: 'code_interpreter' }],
            s3_url: content.data.url,
          });
        }
      }
      return await this.openaiService.addMessageToThread(
        threadId,
        message.content.length > 0 ? message.content[0].value : message,
        attachments,
      );
    } catch (error) {
      console.error('Error adding message to thread', error);
    }
  }

  @Post('/thread/:threadId/:runId/tool_output')
  async addToolOutputToThread(
    @Param('threadId') threadId: string,
    @Param('runId') runId: string,
    @Body()
    toolOutput: {
      id: string;
      out: object;
    }[],
  ) {
    try {
      return await this.openaiService.submitToolOutputs(
        toolOutput,
        threadId,
        runId,
      );
    } catch (error) {
      console.error('Error adding tool output to thread', error);
    }
  }

  @Get('/thread/:threadId/required_actions')
  async getRequiredActions(@Param('threadId') threadId: string) {
    try {
      return await this.openaiService.getCurrentRun(threadId);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Sse('/thread/:threadId')
  @Get('/thread/:threadId')
  @Header('Content-Type', 'text/event-stream')
  @Header('Cache-Control', 'no-cache, no-transform')
  @Header('Content-Encoding', 'none')
  @Header('Transfer-Encoding', 'chunked')
  async getThread(
    @Param('threadId') threadId: string,
    @Req() req,
    @Query('userId') userId,
  ) {
    //add message to thread
    const token = await this.openaiService.generateToken(userId);

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

  @Sse('/thread/:threadId/:assistantId')
  @Get('/thread/:threadId/:assistantId')
  @Header('Content-Type', 'text/event-stream')
  @Header('Cache-Control', 'no-cache, no-transform')
  @Header('Content-Encoding', 'none')
  @Header('Transfer-Encoding', 'chunked')
  async runThreadOnAssistant(
    @Param('threadId') threadId: string,
    @Param('assistantId') assistantId: string,
    @Req() req,
    @Query('userId') userId,
  ) {
    const token = await this.openaiService.generateToken(userId);
    //add message to thread
    try {
      const [observer, sub] = await this.openaiService.runAssistant(
        threadId,
        token,
        assistantId,
      );

      return observer;
    } catch (error) {
      console.error('Error adding message to thread', error);
    }
  }

  /// ---- Below are Knowledge Base API Endpoints ----

  @Get('/knowledge-base')
  async getKnowledgeBase(@Query('owner') owner: any) {
    try {
      return await this.openaiService.getKnowledgeBases(owner);
    } catch (error) {
      console.error('Error getting knowledge base', error);
    }
  }

  @Get('/knowledge-base/:knowledgeBaseId')
  async getKnowledgeBaseById(
    @Param('knowledgeBaseId') knowledgeBaseId: string,
    @Query('owner') owner: any,
  ) {
    try {
      return await this.openaiService.getKnowledgeBase(knowledgeBaseId, owner);
    } catch (error) {
      console.error('Error getting knowledge base by id', error);
    }
  }

  @Post('/knowledge-base')
  async createKnowledgeBase(@Body() knowledgeBase: any) {
    try {
      return await this.openaiService.createKnowledgeBase(
        knowledgeBase,
        '66247c8b47b52805d21f2187',
      );
    } catch (error) {
      console.error('Error creating knowledge base', error);
    }
  }

  // ==== Agent API Endpoints ====

  @Get()
  async getAgents(@Query('owner') owner: any) {
    try {
      return await this.openaiService.getAgents(owner);
    } catch (error) {
      console.error('Error getting agents', error);
    }
  }

  @Get('/:agentId')
  async getAgentById(
    @Param('agentId') agentId: string,
    @Query('owner') owner: any,
  ) {
    try {
      return await this.openaiService.getAgent(agentId, owner);
    } catch (error) {
      console.error('Error getting agent by id', error);
    }
  }

  @Post()
  async createAgent(@Body() agent: any) {
    try {
      return await this.openaiService.createAgent(agent);
    } catch (error) {
      console.error('Error creating agent', error);
    }
  }

  @Put('/:agentId')
  async updateAgent(@Param('agentId') agentId: string, @Body() agent: any) {
    try {
      return await this.openaiService.updateAgent(agentId, agent);
    } catch (error) {
      console.error('Error updating agent', error);
    }
  }
}
