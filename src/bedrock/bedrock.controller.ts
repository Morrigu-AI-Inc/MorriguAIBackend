import { Controller, Get, Header, Logger, Query, Sse } from '@nestjs/common';

import { BedrockService } from './bedrock.service';
import { Observable, Subscriber } from 'rxjs';
import * as yup from 'yup';

import { ActionsService } from 'src/actions/actions.service';
import { Xml2JsonServiceService } from 'src/xml2-json-service/xml2-json-service.service';
import { BuildPromptService } from 'src/tools/build_prompt/build_prompt.service';
import { PrompthistoryService } from 'src/prompthistory/prompthistory.service';
import { QueryResponseDocument } from 'src/db/schemas/QueryResponse';
import { QueryResponsePairDocument } from 'src/db/schemas/QueryResponsePair';
import { MediaService } from 'src/media/media.service';
import { ToolsService } from 'src/tools/tools.service';
import { AnthropicService } from 'src/anthropic/anthropic.service';
import {
  MessageDeltaEvent,
  MessageParam,
  MessageStopEvent,
  TextBlockParam,
} from '@anthropic-ai/sdk/resources';
import {
  Tool,
  ToolUseBlock,
  ToolsBetaMessageParam,
} from '@anthropic-ai/sdk/resources/beta/tools/messages';
type Payload = {
  body: {
    prompt: string;
    max_tokens_to_sample: number;
  };
  modelId: string;
};

const validation = yup.object<Payload>().shape({
  id: yup.string().required('id is required.'),
  payload: yup.object().shape({
    body: yup
      .object()
      .shape({
        prompt: yup.string().required('prompt is required.'),
        max_tokens_to_sample: yup
          .number()
          .required('max_tokens_to_sample is required.'),
      })
      .required('body is required.'),
    historyId: yup.string(),
    modelId: yup.string().required('modelId is required.'),
    promptId: yup.string(),
    prompt: yup.string(),
    model: yup.string(),
  }),
});

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
        required: true,
        default: '',
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
        required: true,
        default: '',
      },
    ],
  },
  // {
  //   tool_name: 'web_search',
  //   description:
  //     'This tool allows your to perform searches for information not in your model knowledge. This should not be your go to information sourcing tool. You can provide a search query to indicate the information you are looking for, such as "latest technology trends" or "ai strategies for business vertical x". The tool will return a list of relevant search results based on your query.',
  //   parameters: [
  //     {
  //       name: 'query',
  //       type: 'string',
  //       description:
  //         'This parameter accepts the search query you want to perform. The query should be concise yet descriptive, focusing on the information you are looking for. This allows the Web Search tool to accurately interpret your search intent and return relevant results.',
  //     },
  //   ],
  // },
];

const global_prompt = `
Morrigu, the following is a conversation between you and the user. The user has asked for help with a specific task.
`;

const global_system = `
${global_prompt}

You have access to various IPaaS tools that can help you complete the task effectively. These tools are managed by the system and do not require any credentials or API keys to use.
Paragon is a integration platform that allows you to connect different applications and services to automate workflows and data exchange. You can use the integrated internal system tools that leverage Paragon to complete the task effectively.

<paragon>
Source: 
Benefits of Embedded integrations
In contrast, embedded integrations would live within your app’s interface, and would require no additional lift on your customers’ end to activate, as you will have configured the integration workflows for them.

This creates a significantly more streamlined experience for your users. All they would need to do is login through OAuth to authenticate access to their other apps, map their custom fields if needed, and the workflows would go live without any extra steps. This inherently unlocks additional value for both you and your customers on multiple fronts.


Product Adoption

From an onboarding and adoption perspective, enabling your users to activate integrations within your app in one click will drive them to the ‘Aha’ moment significantly quicker by ingesting data from their existing tools (such as CRM, marketing automation, and accounting data), and allow them to visualize how your product fits with their existing workflows right away.


Every additional step your prospects and customers need to take to get up and running serves as an additional layer of friction that makes it less likely for them to adopt your product. Whether it’s having to clean and import/export CSVs of data to or from your app, or setting up their own account and integration workflows through Zapier, you want to minimize the time they need to spend outside of your app to get to their desired outcomes.

Customer success resource savings

When it comes to your own operations, centralizing the management of every deployment of an integration workflow will save your customer success team hours of troubleshooting. Instead of having to tackle each Zapier implementation’s issue for individual customers on a per use-case basis, which can often be due to user error, embedding integrations allows a single patch to fix any issues for all of your users at once. 

Revenue Expansion

Finally, providing embedded integrations leaves you the opportunity to monetize your integrations. For example, you may include certain integrations only in the higher tiers of your product, or offer it as an add-on to your customers’ existing plans. Given that customers would otherwise be paying Zapier to build out and manage the integrations themselves, this is commonly an easy upsell for SaaS companies.

Despite the obvious benefits of embedding integrations natively in your app, in recent years, many companies have still opted to build Zapier connectors as a way to address the swarm of integration requests from their prospects and customers, simply because they couldn’t afford to allocate 6-8 weeks of engineering per integration. Frankly, if embedded integration platforms like Paragon didn’t exist in the market, this was a logical decision. However, this brings us to our final point - the onset of embedded integration platforms. 
</paragon>
Choose to respond to the user or to start the task. If you choose to respond, provide a brief response to the user before starting the task. If you choose to start the task, politely ask the user to wait a moment while you work on it.

Then follow the steps below to complete the task effectively.

Before looking for tools, you should follow these steps:

First you need to gather your thoughts by:

<thinking>
$THOUGHTS
</thinking>`;

const system_2 = `
${global_prompt}
${global_system}

Task: 
Inform the user that you are working to complete the task and to politely wait a moment.

The tools available are third party integrations that is managed by the system. You can use these tools to complete the task effectively.

To get access to the tools you need to search for them. Provide a concise yet descriptive query to the search_for_more_tools tool to get a list of relevant tools tailored to your requirements.

Output the query to the search_for_more_tools tool by outputting:

<tool_search_query>$QUERY</tool_search_query>

Rules: 

1. The tools are third party integrations that are managed by the system.
2. You can use the tools to complete the task effectively.
3. No credentials or API keys are required to use any tools.
4. You can search for tools by providing a descriptive query to the <tool_search_query> output.

Do not make up information or provide false information to the user. 
If you are unsure about the information, you can ask the user for clarification or provide a general response.
Do not make up or try to use tools that do not exist in the system or you haven't looked for.



`;

@Controller('bedrock')
export class BedrockController {
  private readonly logger = new Logger(BedrockController.name);

  constructor(
    private readonly bedrockService: BedrockService,
    private readonly actionService: ActionsService,
    private readonly xml2JsonService: Xml2JsonServiceService,
    private readonly buildPromptService: BuildPromptService,
    private readonly historyService: PrompthistoryService,
    private readonly mediaService: MediaService,
    private readonly toolService: ToolsService,
    private readonly anthropicService: AnthropicService,
  ) {}

  @Sse('invoke/:featureId')
  @Get('invoke/:featureId')
  @Header('Content-Type', 'text/event-stream')
  @Header('Cache-Control', 'no-cache, no-transform')
  @Header('Content-Encoding', 'none')
  @Header('Transfer-Encoding', 'chunked')
  async invoke(@Query('payload') payload: string): Promise<Observable<any>> {
    // we need a new architecture for this.
    // we need the history obviously.
    // we need the media

    // we need to generate a prompt to search for relevant tools first
    // we need to search for relevant sources of information for the query if needed
    // we need to generate the prompt for the model

    // final prompt to get the final response

    // parse the payload
    const validPayload = JSON.parse(payload);

    // fetch media
    const media = await this.mediaService.getAllByIds(validPayload.media);

    if (!media) {
      throw new Error(
        'Media not found. Media should have been uploaded before this point.',
      );
    }

    // save the query to the history
    const added = await this.historyService.getHistoryById(
      validPayload.historyId,
    );

    // fetch media
    const tempb64Strings = [];
    for (const m of media) {
      const image = await this.mediaService.getMediaBase64(m._id);
      tempb64Strings.push(image);
    }

    // set the messages
    const messages = [];

    // construct ths messages
    for (const pair of added.history) {
      const { query, response } =
        pair as unknown as Partial<QueryResponsePairDocument>;

      if (query) {
        const text =
          ((query as QueryResponseDocument).body as object)['text'] ||
          '<empty></empty>';
        const media: string[] = (
          (query as QueryResponseDocument).body as object
        )['media'];

        const mediaMsgs = [];

        if (media) {
          for (const m of media) {
            const image = await this.mediaService.getMediaBase64(m);
            mediaMsgs.push({
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: image,
              },
            });
          }
        }

        const appendMsg = {
          role: 'user',
          content: [
            ...mediaMsgs,
            {
              type: 'text',
              text: text,
            },
          ],
        };

        messages.push(appendMsg);
      }
      // if response and is last one

      if (response) {
        const text = ((response as QueryResponseDocument).body as object)[
          'text'
        ];
        messages.push({
          role: 'assistant',
          content: [
            {
              type: 'text',
              text: (text as string)?.trim() || '<empty></empty>',
            },
          ],
        });
      }

      if (!response && pair !== added.history[added.history.length - 1]) {
        messages.push({
          role: 'assistant',
          content: [
            {
              type: 'text',
              text: '<empty></empty>',
            },
          ],
        });
      }
    }

    try {
      const messageThread: MessageParam[] = messages.map((m) => {
        return {
          role: m.role,
          content: m.content,
        };
      });

      const default_tools = await this.toolService.searchToolsV2(
        'web_search, search_for_more_tools, get_tool_description',
      );

      const final_system = `
      ${system_2}

      Here are some default tools available to you (there are more tools available, you can search for them using the search_for_more_tools tool):
      ${JSON.stringify(default_tools, null, 2)}

      `;

      return new Observable((observer: Subscriber<any>) => {
        const completion = [];

        this.recurseStream(
          final_system,
          2000,
          messageThread,
          completion,
          validPayload.token,
          {
            onConnect: this.onConnect,
            onError: this.onError,
            onFinalMessage: (message) => {
              this.onFinalMessage(message, validPayload.historyId, completion);
            },
            onStreamEvent: (event: MessageDeltaEvent, snapshot) => {
              return this.onStreamEvent(
                event,
                snapshot,
                messages,
                system_2,
                2000,
                validPayload.token,
                validPayload.historyId,
                true,
                observer,
                completion,
              );
            },
            onEnd: this.onEnd,
          },
          observer,
        );
      });
    } catch (error) {
      this.logger.error('Error invoking stream', error);
    }
  }

  private async onConnect() {
    console.log('Connected');
  }

  private async onError(error: any) {
    console.log('Error', error);
  }

  private async onFinalMessage(
    message: any,
    historyId: string,
    completion: any[],
  ) {
    if (message.stop_reason === 'stop_sequence') {
      if (message.stop_sequence === '<thinking>') {
        completion.push(message);
        console.log('thinking', message.content, historyId);
      } else if (message.stop_sequence === '</thinking>') {
        console.log('end_thinking', message.content, historyId);
      } else if (message.stop_sequence === '<tool_search_query>') {
        console.log('tool_search_query', message.content, historyId);
      } else if (message.stop_sequence === '</tool_search_query>') {
        console.log('end_tool_search_query', message.content, historyId);
      } else {
        console.log('stop_sequence', message.content, historyId);
      }
    }
    if (message.stop_reason === 'end_turn') {
      this.historyService.appendResponseToHistory;
      completion.push(message);
      const textCompletion = completion
        .flatMap((c) => c.content.map((t) => t.text.trim()))
        .join('\n')
        .trim();

      const newTHing = await this.historyService.appendResponseToHistory(
        historyId,
        {
          body: {
            text: textCompletion,
          },
        },
      );

      console.log('newThing', newTHing);
    }
  }

  private async onEnd() {
    console.log('Stream ended');
  }

  private async onStreamEvent(
    event: MessageDeltaEvent | MessageStopEvent,
    snapshot: any,
    messages: any[],
    system: string,
    max_tokens: number,
    token: string,
    historyId: string,
    shouldRecurse: boolean,
    observer: Subscriber<any>,
    completion: any[],
  ) {
    if (event.type === 'message_stop') {
      console.log(
        'Stream Event',
        event.type,
        JSON.stringify(event, null, 2),
        snapshot,
      );
    }

    observer.next({ data: event });

    // Consider storing event details in messages if necessary
    // messages.push(event); // Append the new event to the conversation history

    if ((event as MessageDeltaEvent)?.delta?.stop_reason === 'stop_sequence') {
      const continueStreaming = await this.handleStopConditions(
        event as MessageDeltaEvent,
        system,
        messages,
        snapshot,
        token,
        {
          onConnect: this.onConnect,
          onError: this.onError,
          onFinalMessage: (message) => {
            this.onFinalMessage(message, historyId, completion);
          },
          onStreamEvent: (event: MessageDeltaEvent, snapshot) => {
            return this.onStreamEvent(
              event,
              snapshot,
              messages,
              system,
              max_tokens,
              token,
              historyId,
              shouldRecurse,
              observer,
              completion,
            );
          },
          onEnd: this.onEnd,
        },

        observer,
      );
      if (shouldRecurse && continueStreaming) {
        // Pass the updated messages array for the next recursion
        await this.recurseStream(
          system,
          max_tokens,
          messages,
          completion,
          token,
          {
            onConnect: this.onConnect,
            onError: this.onError,
            onFinalMessage: (message) => {
              this.onFinalMessage(message, historyId, completion);
            },
            onStreamEvent: async (event: MessageDeltaEvent, snapshot) => {
              return this.onStreamEvent(
                event,
                snapshot,
                messages,
                system,
                max_tokens,
                token,
                historyId,
                shouldRecurse,
                observer,
                completion,
              );
            },
            onEnd: this.onEnd,
          },
          observer,
        );
      }
    }
  }

  public async recurseStream(
    system: string,
    max_tokens: number,
    messages: any[], // This array will hold the entire conversation history
    completion: any[],
    token: string,
    {
      onConnect,
      onError,
      onFinalMessage,
      onStreamEvent,
      onEnd,
    }: {
      onConnect?: () => void;
      onError?: (error: any) => void;
      onFinalMessage?: (message: any) => void;
      onStreamEvent?: (event: MessageDeltaEvent, snapshot: any) => void;
      onEnd?: () => void;
    },
    observer?: Subscriber<any>,
  ) {
    try {
      await this.anthropicService.runPromptStreaming(
        system,
        max_tokens,
        messages,
        {
          onConnect: onConnect,
          onError: onError,
          onFinalMessage: onFinalMessage,
          onStreamEvent: onStreamEvent,
          onEnd: onEnd,
        },
      );
    } catch (error) {
      observer?.error(error);
    }
  }

  // Assume handleStopConditions and handleStopSequence remain the same

  private async handleStopConditions(
    event: MessageDeltaEvent,
    system: string,
    messages: any[],
    snapshot: any,
    token: string,
    {
      onConnect,
      onError,
      onFinalMessage,
      onStreamEvent,
      onEnd,
    }: {
      onConnect?: () => void;
      onError?: (error: any) => void;
      onFinalMessage?: (message: any) => void;
      onStreamEvent?: (event: MessageDeltaEvent, snapshot: any) => void;
      onEnd?: () => void;
    },
    observer?: Subscriber<any>,
  ): Promise<boolean> {
    // if (event.delta.stop_reason === 'stop_sequence') {

    switch (event.delta.stop_reason) {
      case 'stop_sequence':
        return await this.handleStopSequence(
          event,
          system,
          messages,
          snapshot,
          token,
          {
            onConnect: onConnect,
            onError: onError,
            onFinalMessage: onFinalMessage,
            onStreamEvent: onStreamEvent,
            onEnd: onEnd,
          },
          observer,
        );

      case 'max_tokens':
        return true; // Continue streaming if max tokens reached
      case 'end_turn':
        // observer?.complete();
        return false; // End recursion
      default:
        return false; // Default to not continuing the recursion for unhandled cases
    }
    // }
  }

  private async handleStopSequence(
    event: MessageDeltaEvent,
    system: string,
    messages: any[],
    snapshot: any,
    token: string,
    {
      onConnect,
      onError,
      onFinalMessage,
      onStreamEvent,
      onEnd,
    }: {
      onConnect?: () => void;
      onError?: (error: any) => void;
      onFinalMessage?: (message: any) => void;
      onStreamEvent?: (event: MessageDeltaEvent, snapshot: any) => void;
      onEnd?: () => void;
    },
    observer?: Subscriber<any>,
  ): Promise<boolean> {
    switch (event.delta.stop_sequence) {
      case '<thinking>':
        // these should not be cast to the observer but they should be included in the message thread
        if (messages[messages.length - 1].role === 'assistant') {
          messages[messages.length - 1].content.push({
            type: 'text',
            text: '<thinking>',
          });
        } else {
          messages.push({
            role: 'assistant',
            content: [
              {
                type: 'text',
                text: '<thinking>',
              },
            ],
          });
        }

        const response = await this.anthropicService.runPromptNonStreaming(
          system_2,
          2000,
          messages,
        );

        messages[messages.length - 1].content.push(
          ...response.content.map((c) => {
            return {
              type: 'text',
              text: c.text.trim(),
            };
          }),
          {
            type: 'text',
            text: '</thinking>',
          },
          {
            type: 'text',
            text: '<tool_search_query>',
          },
        );

        return true; // Return true to indicate the stream should continue
      case '</thinking>':
        return false; // Return true to indicate the stream should continue
      case '<tool_search_query>':
        return false; // Return true to indicate the stream should continue
      case '</tool_search_query>':
        if (messages[messages.length - 1].role === 'assistant') {
          messages[messages.length - 1].content.push({
            type: 'text',
            text: '</tool_search_query>',
          });
        } else {
          messages.push({
            role: 'assistant',
            content: [
              {
                type: 'text',
                text: snapshot.content[0].text,
              },
              {
                type: 'text',
                text: '</tool_search_query>',
              },
            ],
          });
        }

        const tools = await this.toolService.searchToolsV2(
          snapshot.content[0].text,
        );
        console.log(
          'Found Tools',
          tools.map((t) => t.name),
        );
        const tool_msgs: ToolsBetaMessageParam[] = [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Now that you have the tools and you have thought about the task, please use the tools to complete the task.',
              },
            ],
          },
        ];

        console.log(JSON.stringify([...messages, ...tool_msgs], null, 2));

        let tool_response =
          await this.anthropicService.runPromptWithToolsNonStreaming(
            system,
            2000,
            [...messages, ...tool_msgs],
            tools as Tool[],
            [],
          );

        while (tool_response.stop_reason === 'tool_use') {
          tool_msgs.push({
            role: 'assistant',
            content: tool_response.content as (TextBlockParam | ToolUseBlock)[],
          });

          const responses = await this.actionService.routeFunctionCalls(
            tool_response.content[1],
            token,
          );

          tool_msgs.push({
            role: 'user',
            content: [
              {
                type: 'tool_result',
                tool_use_id: (tool_response.content[1] as ToolUseBlock).id,
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify(responses, null, 2),
                  },
                ],
              },
            ],
          });

          tool_response =
            await this.anthropicService.runPromptWithToolsNonStreaming(
              system,
              2000,
              [...messages, ...tool_msgs],
              tools as Tool[],
              [],
            );

          messages[messages.length - 1].content.push(tool_response.content[0]);

          await this.anthropicService.runPromptStreaming(
            `
          ${global_prompt}

          Summarize the response and provide the user with the results. Call additional tools if necessary.

          ${JSON.stringify((tool_response.content[0] as TextBlockParam).text, null, 2)}
          `,
            2000,
            [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: 'Summarize the response and provide me with the results.',
                  },
                ],
              },
              {
                role: 'assistant',
                content: [
                  {
                    type: 'text',
                    text: 'I will now summarize the response and provide you with the results.',
                  },
                ],
              },
            ],
            {
              onStreamEvent: onStreamEvent,
              onFinalMessage: onFinalMessage,
              onConnect: onConnect,
              onError: onError,
              onEnd: onEnd,
            },
          );

          // tool_response.stop_reason = 'stop_sequence';
        }

        return true; // Return true to indicate the stream should continue

      default:
        return false; // Default to not continuing the recursion for unhandled cases
    }
  }
}
