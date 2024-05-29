import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import tools from 'src/tool_json';
import { change_assistant_tool } from 'src/tool_json/compiled_taps/change_assistant';
import assistants from 'src/assistant/assistants_json';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ToolInput } from 'src/db/schemas/ToolInput';
import { VectorStore } from 'src/db/schemas/VectorStore';
import { AssistantTool } from 'openai/resources/beta/assistants';
import { Assistant } from 'src/db/schemas';
import { AssistantResponseFormatOption } from 'openai/resources/beta/threads/threads';

@Injectable()
export class AssistantService {
  public assistants = assistants;

  private openai: OpenAI;

  constructor(
    @InjectModel('VectorStore') private vectorStoreModel: Model<VectorStore>,
    @InjectModel('Assistant') private assistantModel: Model<Assistant>,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const init = async () => {
      for (const key in this.assistants) {
        // await this.openai.beta.assistants.update(this.assistants[key].id, {
        //   instructions: this.assistants[key].description,
        //   name: this.assistants[key].name,
        //   tools: [...this.assistants[key].tools, change_assistant_tool],
        //   model: this.assistants[key].model,
        //   response_format: 'auto',
        //   // file_ids: ['file-abc123', 'file-abc456'],
        // });
      }
    };

    init();
  }

  public updateAssistant = async (
    instructions = 'You are knowledgeable about the tools available to you. You can ask me to update the tools available to you.',
    assistant_name = 'Morrigu',
    model = 'gpt-4-turbo-2024-04-09',
  ) => {
    this.openai.beta.assistants.update(process.env.DEFAULT_ASSISTANT, {
      instructions: instructions,
      name: assistant_name,
      tools: [...(tools as any), change_assistant_tool],
      model: model,
      response_format: 'auto',
      // file_ids: ['file-abc123', 'file-abc456'],
    });
  };

  public getAssistant = async (id) => {
    return await this.openai.beta.assistants.retrieve(id);
  };

  public getAssistants = async () => {
    return await this.openai.beta.assistants.list();
  };

  public deleteAssistant = async (id) => {
    return await this.openai.beta.assistants.del(id);
  };

  public runAssistantOnce = async (assistant_id, prompt) => {};

  public async createAssistant(
    owner,
    vector_stores,
    response_format: AssistantResponseFormatOption = 'auto',
    tool: {
      name: string;
      description: string;
      tools: AssistantTool[];
    } = {
      name: assistants.tools.name,
      description: assistants.tools.description,
      tools: assistants.tools.tools as AssistantTool[],
    },
  ) {
    const assistant = await this.openai.beta.assistants.create({
      instructions: tool.description,
      name: tool.name,
      tools: tool.tools,
      tool_resources: {
        file_search: {
          vector_store_ids: [vector_stores],
        },
      },
      model: 'gpt-4o',
      response_format: response_format,
    });

    console.log('assistant', assistant);

    return await this.assistantModel.create({
      id: assistant.id,
      owner: owner,
      meta: assistant,
    });
  }

  // These functions manage the vector databases

  public createVectorDatabase = async (name, owner: string) => {
    const vs = await this.openai.beta.vectorStores.create({
      name: name,
    });

    console.log('vs', vs);

    return await this.vectorStoreModel.create({
      name: name,
      id: vs.id,
      owner: owner,
    });
  };

  public upadateFileIds = async (id, file_id) => {
    return await this.openai.beta.vectorStores.files.create(id, {
      file_id: file_id,
    });
  };

  public getVectorDatabase = async (id) => {
    return await this.openai.beta.vectorStores.retrieve(id);
  };

  public getVectorDatabases = async () => {
    return await this.openai.beta.vectorStores.list();
  };

  public deleteVectorDatabase = async (id) => {
    return await this.openai.beta.vectorStores.del(id);
  };
}
