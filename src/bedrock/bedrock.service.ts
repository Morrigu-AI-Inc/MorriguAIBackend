import { Injectable, Logger } from '@nestjs/common';
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelWithResponseStreamCommand,
  ResponseStream,
} from '@aws-sdk/client-bedrock-runtime'; // ES Modules import

import { PromptflagService } from 'src/promptflag/promptflag.service';
import { QueryDocument } from 'src/db/schemas/Query';
import { QueryResponseDocument } from 'src/db/schemas/QueryResponse';
import { QueryResponsePairDocument } from 'src/db/schemas/QueryResponsePair';
import { Observable, Subscriber } from 'rxjs';
import { ActionsService } from 'src/actions/actions.service';
import { Xml2JsonServiceService } from 'src/xml2-json-service/xml2-json-service.service';
import { BuildPromptService } from 'src/tools/build_prompt/build_prompt.service';
import { PrompthistoryService } from 'src/prompthistory/prompthistory.service';
import { MessageParam } from '@anthropic-ai/sdk/resources';

type BodyProps = {
  prompt: string;
  temperature?: number;
  top_p?: number;
  top_k?: number;
  max_tokens_to_sample: number;
  stop_sequences?: Array<string>;
};

export type MessageProp = {
  role: string;
  content: Array<{ type: 'text' | 'image'; text: string }>;
};

type ResolverProps = {
  observer: Subscriber<any>;
  stream: AsyncIterable<ResponseStream>;
  completion: string;
  messages?: MessageProp[];
  system?: string;
  tasks?: string[];
  persona?: string;
  token: string;
};

const defaultTools = [
  {
    tool_name: 'search_for_more_tools',
    description:
      'This tool allows you to search for additional tools that may be useful in solving the user\'s query. You can provide a descriptive query to indicate the nature of the tool needed, such as "data visualization software" or "real-time weather API". The tool will return a list of relevant tools tailored to your requirements. Some tools include web_search.',
    parameters: [
      {
        name: 'tool_search_query',
        type: 'string',
        description:
          'This parameter accepts a descriptive query indicating the nature of the tool needed. The query should be concise yet descriptive, focusing on the tool\'s intended purpose or the problem it solves, such as "data visualization software" or "real-time weather API". This allows the Enhanced Tool Discovery to accurately interpret your needs and return a list of relevant tools tailored to your requirements.',
      },
    ],
  },
  {
    tool_name: 'get_tool_description',
    description:
      'This tool allows you to retrieve detailed information about a specific tool. You can provide the name of the tool you are interested in, and the tool will return a detailed description of its functionality, use cases, and any required parameters.',
    parameters: [
      {
        name: 'tool_name',
        type: 'string',
        description:
          "This parameter accepts the name of the tool you are interested in. The name should be accurate and match the tool's official name to ensure the tool description is retrieved correctly.",
      },
    ],
  },
  // {
  //   tool_name: 'web_search',
  //   description: 'This is a simple google search tool.',
  //   parameters: [
  //     {
  //       name: 'query',
  //       type: 'string',
  //       description: 'This is a simple google search tool.',
  //     },
  //   ],
  // },
];

@Injectable()
export class BedrockService {
  private logger = new Logger(BedrockService.name);

  constructor(
    private readonly promptFlagService: PromptflagService,
    private readonly actionService: ActionsService,
    private readonly xml2JsonService: Xml2JsonServiceService,
    private readonly buildPromptService: BuildPromptService,
  ) {}
  InvokeModelWithResponseStream = async (
    body: string,
    modelId: string,
    historyId?: string,
    meta?: {
      modelId: string;
      promptId: string;
    },
  ) => {
    this.logger.log(
      'InvokeModelWithResponseStream called',
      body,
      modelId,
      historyId,
      meta,
    );

    const {
      flag,
      prompt,
      model,
      formattings,
      inf_params,
      history,
    }: {
      flag: any;
      prompt: any;
      model: any;
      formattings: any;
      inf_params: any;
      history: any;
    } = await this.promptFlagService.findOne(
      '65e298b099d3186571f00b64',
      '65e2419578ded9ac763cba7e',
      historyId,
      meta?.modelId,
      meta?.promptId,
    );

    const promptToUse = prompt;

    let promptToInvoke = `${promptToUse.system_message}\n\n`;

    if (history) {
      for (let i = 0; i < history?.length; i++) {
        const pair = history[i] as unknown as QueryResponsePairDocument;
        const query = pair.query as unknown as QueryDocument;

        const response = pair.response as unknown as QueryResponseDocument;

        // YOU LEFT OFF TRYING TO GET HISTORY WORKING AGAIN

        promptToInvoke += `${formattings?.user_prefix} ${query.body['text']}\n\n${formattings?.assistant_prefix} ${
          response?.body?.['text'] || ''
        }\n\n`;
      }
    } else {
      promptToInvoke += `${formattings?.user_prefix} ${JSON.parse(body).prompt}\n\n${formattings?.assistant_prefix} `;
    }

    const bedrock = new BedrockRuntimeClient({ region: 'us-east-1' });

    console.log(inf_params);

    const input = {
      // InvokeModelRequest
      body: JSON.stringify({
        ...(JSON.parse(body) as BodyProps),
        ...inf_params,
        prompt: promptToInvoke,
      }), // required
      contentType: 'application/json',
      accept: 'application/json',
      modelId: modelId,
    };

    const command = new InvokeModelWithResponseStreamCommand(input);
    const response = await bedrock.send(command);

    return response.body as AsyncIterable<ResponseStream>;
  };

  async InvokeModel(body: string, system?: string, num_tokens?: number) {
    const bedrock = new BedrockRuntimeClient({ region: 'us-east-1' });

    const input = {
      // InvokeModelRequest
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: num_tokens || 500,
        system: system,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: body,
              },
            ],
          },
        ],
      }), // required
      contentType: 'application/json',
      accept: 'application/json',
      modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
    };

    const command = new InvokeModelCommand(input);
    const response = await bedrock.send(command);

    return new TextDecoder().decode(response.body as Uint8Array);
  }

  async InvokeModelWithStream(
    system: string,
    messages: MessageParam[],
    options: {
      stream?: boolean;
      modelId?: string;
    } = {
      stream: true,
      modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
    },
  ): Promise<AsyncIterable<ResponseStream> | string> {
    try {
      console.log(JSON.stringify(messages, null, 2));

      const bedrock = new BedrockRuntimeClient({ region: 'us-east-1' });

      const input = {
        // InvokeModelRequest
        body: JSON.stringify({
          anthropic_version: 'bedrock-2023-05-31',
          max_tokens: 4000,

          stop_sequences: [
            '\n\nHuman:',
            '<function_calls>',
            '</function_calls>',
            '<answer>',
            '</answer>',
            '<thinking>',
            '</thinking>',
            '<frontend_calls>',
            '</frontend_calls>',
            '<tool_use>',
            // '<invoke>',
            // '</invoke>',
          ],
          system: system,
          messages: messages,
        }), // required
        contentType: 'application/json',
        accept: 'application/json',
        // modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
        modelId: options.modelId,
      };

      // how to we verify that messages alternate user/assistant?
      // answer: sometimes the messages get mixed up either because of lage or whatever. what we need to do I think is fill in the blanks with blank messages maybe?
      console.log('Calling Bedrock as time: ', new Date().getTime());
      if (options.stream) {
        const command = new InvokeModelWithResponseStreamCommand(input);
        const response = await bedrock.send(command);

        return response.body as AsyncIterable<ResponseStream>;
      } else {
        const command = new InvokeModelCommand(input);
        const response = await bedrock.send(command);

        return new TextDecoder().decode(response.body as Uint8Array);
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  async processStopReasons(
    completion: string,
    parseChunnk: {
      completion: string;
      stop_reason: string;
      stop: string;
    },
    observer: Subscriber<any>,
  ) {
    if (parseChunnk.stop_reason == 'stop_sequence') {
      observer.next({ data: JSON.stringify(parseChunnk) });
      switch (parseChunnk.stop) {
        case '\n\nHuman:': {
          console.log('HUMANx');
          observer.complete();
          break;
        }
        case '<function_calls>':
          console.log('function_calls');
          break;
        case '</function_calls>':
          break;
        default: {
          observer.complete();
          break;
        }
      }
    } else {
      observer.next({ data: JSON.stringify(parseChunnk) });
    }
  }

  async resolveGeneration({
    observer,
    stream,
    completion,
    messages,
    system,
    tasks,
    persona,
    token,
  }: ResolverProps): Promise<ResolverProps> {
    console.log('RESOLVE GENERATION', stream);
    // Lets document this thoroughly
    for await (const chunk of stream) {
      // this is the stream of responses from the model
      const jsonString = new TextDecoder().decode(chunk.chunk?.bytes); // we decode the chunk of bytes to a string
      const parsedChunk = JSON.parse(jsonString); // we parse the string to a JSON object
      let functionXML = ''; // this is the XML that will be used to call the functions

      // we need to handle the different types of chunks that we get from the model
      switch (parsedChunk.type) {
        // this is the start of a message
        case 'message_start': {
          break;
        }

        // this is the start of a message
        case 'content_block_start': {
          console.log('content_block_start', parsedChunk.content_block.text);
          completion += parsedChunk.content_block.text || '';
          observer.next({ data: JSON.stringify(parsedChunk) });
          break;
        }
        // this is the delta of a content block
        case 'content_block_delta': {
          completion += parsedChunk.delta.text;
          observer.next({ data: JSON.stringify(parsedChunk) });
          break;
        }
        // this is the end of a content block
        case 'content_block_stop': {
          break;
        }
        // this is the delta of a message
        case 'message_delta': {
          // if we get a stop sequence we need to handle it or pass
          if (parsedChunk.delta.stop_reason == 'stop_sequence') {
            // we need to handle the stop sequence on the FE
            observer.next({ data: JSON.stringify(parsedChunk) });
            // this is where we will handle the stop sequence
            switch (parsedChunk.delta.stop_sequence) {
              case '</answer>': {
                messages[messages.length - 1].content[0].text += completion;

                break;
              }
              case '<function_calls>': {
                console.log('calling function_calls');
                functionXML += '<function_calls>';
                let assistantMessage;

                if (messages[messages.length - 1].role === 'assistant') {
                  assistantMessage = messages.pop() as MessageProp;
                } else {
                  assistantMessage = {
                    role: 'assistant',
                    content: [
                      {
                        type: 'text',
                        text: '',
                      },
                    ],
                  };
                }

                // were getting a double assistant message here somewhere we need to I think check if the last message was an assistant message
                // if it was then we need to append to the last message instead of pushing a new one
                assistantMessage.content[0].text += completion + functionXML;

                const response = await this.InvokeModelWithStream(
                  system,
                  [...messages, assistantMessage],
                  {
                    stream: false,
                    modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
                  },
                );

                console.log('388', response);

                assistantMessage.content[0].text +=
                  JSON.parse(response as string).content[0].text +
                  '</function_calls>';

                // console.log(assistantMessage.content[0].text);

                const xmlToParse = `<function_calls>${JSON.parse(response as string).content[0].text}</function_calls>`;

                console.log('xmlToParse', xmlToParse);

                const jsonObj =
                  await this.xml2JsonService.convertXmlToJson(xmlToParse);

                console.log(token);

                const fnResults = await this.actionService.routeFunctionCalls(
                  jsonObj,
                  token,
                );

                console.log(
                  'OUTPUT',
                  this.xml2JsonService.jsonToXML(fnResults),
                );

                assistantMessage.content.push({
                  type: 'text',
                  text: `<sources>
                  ${this.xml2JsonService.jsonToXML(fnResults)}
                  </sources>
                  <answer>
                  To provide you with the most accurate and helpful information, I will detail each item discovered during my search. For each entity, I will list out all relevant properties, ensuring a thorough understanding of its characteristics and context. Following the description of each item, I will break down the sources from which this information was derived. This will include the name of the source, the type of content it provides (e.g., academic paper, news article, official website), and key details that support the item's description. This methodical approach ensures that you not only receive comprehensive details about each entity but also understand the origin and reliability of the information provided.

                  Here is a detailed description in readable Markdown format of every item and a breakdown of the sources returned that I found for you:`,
                });

                messages.push(assistantMessage);

                for (let i = 0; i < messages.length; i++) {
                  console.log(messages[i].role, messages[i].content[0]?.text);
                }

                const systemPrompt = this.buildPromptService.buildPrompt({
                  task: tasks,
                  persona: persona,
                  tools: defaultTools,
                  funcResults: this.xml2JsonService.jsonToXML(fnResults),
                  context: '',
                  includeThoughtLoop: false,
                }) as string;

                console.log(...messages);

                const results = await this.InvokeModelWithStream(
                  systemPrompt,
                  [...messages] as MessageParam[],
                  {
                    stream: true,
                    modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
                  },
                );

                console.log('RESULTS', results);

                return await this.resolveGeneration({
                  observer,
                  stream: results as AsyncIterable<ResponseStream>,
                  completion,
                  messages,
                  system,
                  tasks,
                  persona,
                  token,
                });
              }

              case '</function_calls>': {
                completion += '</function_calls>';

                console.log(
                  "We shouldn't really actually hit this but I guess just in case. ",
                );

                break;
              }
              case '<frontend_calls>': {
                console.log('frontend_calls');
                const frontendCalls = '<frontend_calls>';
                let assistantMessage;

                if (messages[messages.length - 1].role === 'assistant') {
                  assistantMessage = messages.pop() as MessageProp;
                } else {
                  assistantMessage = {
                    role: 'assistant',
                    content: [
                      {
                        type: 'text',
                        text: completion,
                      },
                    ],
                  };
                }

                assistantMessage.content[0].text += frontendCalls;

                if (!assistantMessage.content[0].text.includes(frontendCalls)) {
                  console.log('SHOULDNT HIT THIS');
                  assistantMessage.content.push({
                    type: 'text',
                    text: frontendCalls,
                  });
                }

                console.log(
                  'getting frontend calls...',
                  assistantMessage.content,
                );

                const response = await this.InvokeModelWithStream(
                  system,
                  [...messages, assistantMessage],
                  {
                    stream: false,
                  },
                );

                console.log('ending frontend calls...');

                console.log('response', response);

                // append to last message
                assistantMessage.content[0].text += JSON.parse(
                  response as string,
                ).content[0].text;

                assistantMessage.content[0].text += '</frontend_calls>';

                messages.push(assistantMessage);

                const results = await this.InvokeModelWithStream(
                  system,
                  [...messages] as MessageParam[],
                  {
                    stream: true,
                  },
                );

                return await this.resolveGeneration({
                  observer,
                  stream: results as AsyncIterable<ResponseStream>,
                  completion,
                  messages: [...messages],
                  system,
                  tasks,
                  persona,
                  token,
                });
              }
              case '<invoke>': {
                console.log('invoke');
                observer.next({ data: JSON.stringify(parsedChunk) });
                break;
              }
              case '<thinking>': {
                // this stop feature is to allow it to think. We dont want to show the user the thinking so well by pass it.
                console.log('thinking...');

                let assistantMessage;
                const thinkingBlock =
                  "Let's break this down step by step: <thinking>";

                if (messages[messages.length - 1].role === 'assistant') {
                  assistantMessage = messages.pop() as MessageProp;
                } else {
                  assistantMessage = {
                    role: 'assistant',
                    content: [
                      {
                        type: 'text',
                        text:
                          completion != ''
                            ? completion.trim() + thinkingBlock
                            : thinkingBlock,
                      },
                    ],
                  };
                }
                if (!assistantMessage.content[0].text.includes(thinkingBlock)) {
                  console.log('SHOULDNT HIT THIS');
                  assistantMessage.content.push({
                    type: 'text',
                    text: thinkingBlock,
                  });
                }

                console.log('getting thoughts...', assistantMessage.content);

                const response = await this.InvokeModelWithStream(
                  system,
                  [...messages, assistantMessage],
                  {
                    stream: false,
                    modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
                  },
                );
                console.log('ending thoughts...');

                console.log('response', response);

                // append to last message
                assistantMessage.content[0].text +=
                  JSON.parse(response as string).content[0].text || '';

                assistantMessage.content[0].text += '</thinking>';

                messages.push(assistantMessage);

                const results = await this.InvokeModelWithStream(
                  system,
                  [...messages] as MessageParam[],
                  {
                    stream: true,
                    modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
                  },
                );

                console.group(system, messages);

                return await this.resolveGeneration({
                  observer,
                  stream: results as AsyncIterable<ResponseStream>,
                  completion,
                  messages: [...messages],
                  system,
                  tasks,
                  persona,
                  token,
                });
              }
              case '</thinking>': {
                // completion += '</thinking>';

                break;
              }
              case '<invoke>': {
                console.log('invoke', completion);
                observer.next({ data: JSON.stringify(parsedChunk) });

                messages[messages.length - 1].content[0].text +=
                  completion + '<invoke>';
                const response = await this.InvokeModelWithStream(
                  system,
                  [...messages] as MessageParam[],
                  {
                    stream: false,
                  },
                );
                messages[messages.length - 1].content[0].text +=
                  JSON.parse(response as string).content[0].text + '</invoke>';

                const results = await this.InvokeModelWithStream(
                  system,
                  [...messages] as MessageParam[],
                  {
                    stream: true,
                  },
                );

                return await this.resolveGeneration({
                  observer,
                  stream: results as AsyncIterable<ResponseStream>,
                  completion,
                  messages: [...messages],
                  system,
                  tasks,
                  persona,
                  token,
                });
              }
              default: {
                // observer.complete();
                break;
              }
            }
          }

          break;
        }
        case 'message_stop': {
          // this just means the generation for this stream is done and we get some metrics from AWS

          observer.next({ data: JSON.stringify(parsedChunk) });
          observer.complete();

          break;
        }
        default: {
          observer.next({ data: JSON.stringify(parsedChunk) });
          break;
        }
      }

      // Emit each chunk as a message event
      // observer.next({ data: JSON.stringify(parsedChunk) });
    }

    return { observer, stream, completion, token };
  }
}
