import Anthropic from '@anthropic-ai/sdk';
import { APIPromise } from '@anthropic-ai/sdk/core';
import { APIUserAbortError, AnthropicError } from '@anthropic-ai/sdk/error';
import {
  ContentBlock,
  Message,
  MessageParam,
  MessageStreamEvent,
  TextBlockParam,
} from '@anthropic-ai/sdk/resources';
import {
  Tool,
  ToolsBetaMessageParam,
} from '@anthropic-ai/sdk/resources/beta/tools/messages';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AnthropicService {
  private anthropic: Anthropic;
  private readonly stop_sequences: string[] = [
    '\n\nHuman:',
    '<function_calls>',
    '</function_calls>',
    '<answer>',
    '</answer>',
    '<thinking>',
    '</thinking>',
    '<frontend_calls>',
    '</frontend_calls>',
    '<tool_search_query>',
    '</tool_search_query>',
    // '<tool_use>',
  ];
  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_KEY,
    });
  }

  public async runPromptWithToolsNonStreaming(
    system = 'Morrigu',
    max_tokens = 1024,
    messages: ToolsBetaMessageParam[] = [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'What is the weather in San Francisco?',
          },
        ],
      },
    ],
    tools: Tool[] = [
      {
        name: 'get_weather',
        description: 'Get the current weather in a given location',
        input_schema: {
          type: 'object',
          properties: {
            location: {
              type: 'string',
              description: 'The city and state, e.g. San Francisco, CA',
            },
          },
          required: ['location'],
        },
      },
    ],
    stop_sequences: string[] = this.stop_sequences,
  ): Promise<APIPromise<Anthropic.Beta.Tools.Messages.ToolsBetaMessage>> {
    console.log(
      'runPromptWithToolsNonStreaming',
      JSON.stringify(messages, null, 2),
    );
    console.log('runPromptWithToolsNonStreaming');

    // ensure they alternate
    const msgList = [];
    for (let i = 0; i < messages.length; i++) {
      if (msgList[msgList.length - 1]?.role === messages[i].role) {
        // then its not alternating
        msgList.push({
          role: messages[i].role === 'user' ? 'assistant' : 'user',
          content: [{ type: 'text', text: '<empty></empty>' }],
        });
      }

      msgList.push({
        role: messages[i].role,
        content: messages[i].content,
      });

      if (msgList[msgList.length - 1].content.length === 0) {
        msgList[msgList.length - 1].content = [
          { type: 'text', text: '<empty></empty>' },
        ];
      }
    }

    return this.anthropic.beta.tools.messages.create({
      model: 'claude-3-sonnet-20240229',
      system: system,
      max_tokens: max_tokens,
      messages: msgList,
      tools: tools,
      stop_sequences: stop_sequences,
    });
  }

  public async runPromptNonStreaming(
    system = 'Morrigu',
    max_tokens = 1024,
    messages: MessageParam[] = [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'What is the weather in San Francisco?',
          },
        ],
      },
    ],
    stop_sequences: string[] = this.stop_sequences,
  ): Promise<any> {
    const filterMessages = messages
      .filter((message) => {
        return (message.content as TextBlockParam[]).filter((content) => {
          return content.type === 'text';
        });
      })
      .map((message) => {
        return {
          role: message.role,
          content: message.content,
        };
      });

    console.log('non-streaming', JSON.stringify(filterMessages, null, 2));
    console.log('runPromptNonStreaming');

    return this.anthropic.messages.create({
      model: 'claude-3-connet-20240229',
      system: system,
      max_tokens: max_tokens,
      messages: filterMessages,
      stop_sequences: stop_sequences,
    });
  }
  //         connect: () => void;
  // streamEvent: (event: MessageStreamEvent, snapshot: Message) => void;
  // text: (textDelta: string, textSnapshot: string) => void;
  // message: (message: Message) => void;
  // contentBlock: (content: ContentBlock) => void;
  // finalMessage: (message: Message) => void;
  // error: (error: AnthropicError) => void;
  // abort: (error: APIUserAbortError) => void;
  // end: () => void;
  public runPromptStreaming(
    system = 'Morrigu',
    max_tokens = 1024,
    messages: MessageParam[] = [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'What is the weather in San Francisco?',
          },
        ],
      },
    ],

    {
      onText,
      onConnect,
      onStreamEvent,
      onMessage,
      onContentBlock,
      onFinalMessage,
      onError,
      onAbort,
      onEnd,
    }: {
      onText?: (textDelta: string, textSnapshot: string) => void;
      onConnect?: () => void;
      onStreamEvent?: (event: MessageStreamEvent, snapshot: Message) => void;
      onMessage?: (message: Message) => void;
      onContentBlock?: (content: ContentBlock) => void;
      onFinalMessage?: (message: Message) => void;
      onError?: (error: AnthropicError) => void;
      onAbort?: (error: APIUserAbortError) => void;
      onEnd?: () => void;
    },
    stop_sequences: string[] = this.stop_sequences,
  ) {
    const filterMessages = messages.map((message) => {
      return {
        role: message.role,
        content: (message.content as TextBlockParam[]).map((content) => {
          if (content.type !== 'text') {
            return {
              type: 'text',
              text: JSON.stringify(content).trim(),
            };
          }
          return {
            type: 'text',
            text: content.text.trim(),
          };
        }),
      };
    });

    return this.anthropic.messages
      .stream({
        model: 'claude-3-sonnet-20240229',
        system: system,
        max_tokens: max_tokens,
        messages: filterMessages as unknown as MessageParam[],
        stop_sequences: stop_sequences,
      })
      .on('text', (textDelta: string, textSnapshot: string) => {
        return onText?.(textDelta, textSnapshot);
      })
      .on('connect', () => {
        return onConnect?.();
      })
      .on('streamEvent', (event: MessageStreamEvent, snapshot: Message) => {
        return onStreamEvent?.(event, snapshot);
      })
      .on('message', (message: Message) => {
        return onMessage?.(message);
      })
      .on('contentBlock', (content: ContentBlock) => {
        return onContentBlock?.(content);
      })
      .on('finalMessage', (message: Message) => {
        return onFinalMessage?.(message);
      })
      .on('error', (error: AnthropicError) => {
        console.trace('error', error);
        return onError?.(error);
      })
      .on('abort', (error: APIUserAbortError) => {
        return onAbort?.(error);
      })
      .on('end', () => {
        return onEnd?.();
      });
  }
}
