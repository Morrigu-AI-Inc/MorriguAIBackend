import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import tools from 'src/tool_json';

@Injectable()
export class AssistantService {
  private assistants = {
    quickbooks: 'asst_os1O6Teplk4ldDH3SsRKst0p',
    zendesk: 'asst_os1O6Teplk4ldDH3SsRKst0p',
    github: 'asst_os1O6Teplk4ldDH3SsRKst0p',
  };
  private openai: OpenAI;
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  public updateAssistant = async (
    instructions = 'You are knowledgeable about the tools available to you. You can ask me to update the tools available to you.',
    assistant_name = 'Morrigu',
    model = 'gpt-4',
  ) => {
    this.openai.beta.assistants.update(process.env.DEFAULT_ASSISTANT, {
      instructions: instructions,
      name: assistant_name,
      tools: tools as any,
      model: model,
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
