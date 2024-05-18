import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import tools from 'src/tool_json';
import { change_assistant_tool } from 'src/tool_json/compiled_taps/change_assistant';
import assistants from 'src/assistant/assistants_json';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ToolInput } from 'src/db/schemas/ToolInput';

@Injectable()
export class AssistantService {
  public assistants = assistants;

  private openai: OpenAI;

  constructor(@InjectModel('ToolInput') private toolModel: Model<ToolInput>) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const init = async () => {
      const tools_description_text = [];
      await this.toolModel.find().then((tools) => {
        tools.forEach((tool) => {
          tools_description_text.push(
            `============ ${tool.name} ============\n${tool.description} \n`,
          );
        });
      });

      console.log(
        'tools_description_text',
        tools_description_text.join('\n') + '\n',
      );

      for (const key in this.assistants) {
        await this.openai.beta.assistants.update(this.assistants[key].id, {
          instructions: this.assistants[key].description,
          name: this.assistants[key].name,
          tools: [...this.assistants[key].tools, change_assistant_tool],
          model: this.assistants[key].model,
          response_format: 'auto',
          // file_ids: ['file-abc123', 'file-abc456'],
        });
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
}
