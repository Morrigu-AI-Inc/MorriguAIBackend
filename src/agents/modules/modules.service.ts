import { Injectable } from '@nestjs/common';
import { BedrockService } from 'src/bedrock/bedrock.service';

@Injectable()
export class ModulesService {
  private readonly modules: string[] = [];

  private prompt;

  constructor(private readonly bedrockService: BedrockService) {
    console.log('ModulesService instantiated');
    const prompt = `
      Summarize the content:
    `;
    this.compilePrompt(prompt);
  }

  compilePrompt(prompt: string) {
    this.prompt = prompt;
    return prompt;
  }

  async runPrompt(
    messages: {
      role: 'user' | 'assistant';
      content: {
        type: 'text' | 'image';
        text: string;
      }[];
    }[],
    modelId: string = 'anthropic.claude-v2:1',
  ) {
    console.log('runPrompt', messages);
    return this.bedrockService.InvokeModelWithStream(this.prompt, messages, {
      stream: false,
      modelId: modelId,
    });
  }
}
