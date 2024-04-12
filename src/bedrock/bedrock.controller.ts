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
import { ChatMessageType } from 'src/db/schemas/ConversationHistory';
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

const BI_Metrics = {
  BI_Metrics: {
    Sales: [
      'Conversion Rate',
      'Average Order Value (AOV)',
      'Customer Lifetime Value (CLTV)',
      'Sales Growth Year-over-Year',
    ],
    Marketing: [
      'Cost Per Lead (CPL)',
      'Return on Marketing Investment (ROMI)',
      'Customer Acquisition Cost (CAC)',
      'Net Promoter Score (NPS)',
    ],
    IT: [
      'System Downtime',
      'Mean Time to Repair (MTTR)',
      'Mean Time Between Failures (MTBF)',
      'Ticket Resolution Time',
    ],
    General: [
      'Net Profit Margin',
      'Gross Profit Margin',
      'Operating Cash Flow',
      'Return on Investment (ROI)',
    ],
    Operations: [
      'Inventory Turnover Ratio',
      'Efficiency Ratio',
      'Utilization Rate',
      'Employee Turnover Rate',
    ],
    'Human Resources': [
      'Employee Satisfaction Index',
      'Cost per Hire',
      'Absenteeism Rate',
      'Time to Fill',
    ],
    'Customer Service': [
      'First Call Resolution (FCR)',
      'Average Handle Time (AHT)',
      'Customer Satisfaction Score (CSAT)',
      'Customer Effort Score (CES)',
    ],
    Finance: [
      'Debt to Equity Ratio',
      'Current Ratio',
      'Quick Ratio',
      'Working Capital',
    ],
    Product: [
      'Time to Market',
      'Product Return Rate',
      'Product Quality Index',
      'Product Development Lifecycle Time',
    ],
  },
};

const global_prompt = `
===== Business Intelligence Artificial Intelligence Platform Assistant =====
Name: Morrigu
Version: 1.0
Current Date: ${new Date().toDateString()}
Current Time: ${new Date().toLocaleTimeString()}
Domain Of Expertise: Business Intelligence and Data Analysis. Conversational Reporting and Data Visualization.

Here are the metrics this system can help you with:
${JSON.stringify(BI_Metrics, null, 2)}

===== System Information =====

Welcome to the AI Assistant Interface. 
The following is a conversation between you and the user. 
The user has asked for help with a specific task.
`;

const global_system = `
${global_prompt}

You have access to various IPaaS tools that can help you complete the task effectively. 

These tools (searchable through the search_for_more_tools tool) are managed by the system and do not require any credentials or API keys to use.
Paragon is an integration platform that allows us to connect to different applications and services to automate workflows and data exchange. 
You can use the integrated iPaaS internal system tools that leverage Paragon to complete the task effectively.

<paragon_ipaas_description>
Source: 
Morrigu and Paragon Benefits of Embedded integrations
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
</paragon_ipaas_description>

Decide whether the user query requires a response or if you need to complete a task.

If the query does not require work on your part, you can provide a brief response to the user and end the conversation.

IF the query requires work on your part, you can use the tools available to complete the task effectively.

If you need some time to think or process the information, you can let the user know that you are working on the task and politely ask them to wait a moment.

Think by outputting you thoughts like: 

<thinking>
$THOUGHTS
</thinking>
`;

const system_2 = `
${global_prompt}
${global_system}

Task: 
Inform the user that you are working to complete the task and to politely wait a moment.

You can use tools to complete the task effectively. Search for relevant tools by providing a descriptive query to the tool_search_query tool.

To get access to the tools you need to search for them. Provide a concise yet descriptive query based on the conversation to the tool_search_query tool to get a list of relevant tools tailored to your requirements.

Output the query to the tool_search_query tool by outputting:

<tool_search_query>$QUERY</tool_search_query>

Rules: 

1. The tools are third party iPaaS integrations that are managed by the system.
2. You can use the tools to complete the task effectively.
3. No credentials or API keys are required to use any tools.
4. You can search for tools by providing a descriptive query to the <tool_search_query> output.

General Conversation Rules:
1. Be polite and professional in your responses.
2. Provide clear and concise information.
3. Use the tools available to complete the task effectively.
4. If you need some time to think or process the information, you can let the user know that you are working on the task and politely ask them to wait a moment.

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
    this.logger.log('Payload', payload);
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
      const default_tools = await this.toolService.searchToolsV2(
        'web_search, search_for_more_tools, get_tool_description',
      );

      const final_system = `
      ${system_2}

      Here are some default tools available to you (there are more tools available, you can search for them using the search_for_more_tools tool):
      ${JSON.stringify(default_tools, null, 2)}

      `;

      // each user/assistant can have multiple content blocks. Each content block can have multiple text blocks

      // we can ONLY have text blocks when passing it

      const cleaned_history = added.chatHistory.map((h) => {
        if (h.content.length === 0) {
          return {
            role: h.role,
            content: [
              {
                type: 'text',
                text: '<empty></empty>',
              },
            ],
          };
        }
        return {
          role: h.role,
          content: h.content.map((c) => {
            if (c.type !== 'image' && c.type !== 'text') {
              return {
                type: 'text',
                text: JSON.stringify(c).trim(),
              };
            }

            return {
              type: c.type,
              text: c.text.trim() || '<empty></empty>',
            };
          }),
        };
      });

      const tempChats = [];

      // we need to ensure they alternate between user and assistant
      for (const chat of cleaned_history) {
        if (tempChats[tempChats.length - 1]?.role === chat.role) {
          tempChats.push({
            role: chat.role === 'user' ? 'assistant' : 'user',
            content: [
              {
                type: 'text',
                text: '<empty></empty>',
              },
            ],
          });
        }

        tempChats.push(chat);
      }

      this.logger.log('Cleaned history', tempChats);

      return new Observable((observer: Subscriber<any>) => {
        const completion = [];

        this.logger.log('Final system', final_system);

        this.recurseStream(
          final_system,
          2000,
          completion,
          validPayload.historyId,
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

  private async onConnect() {}

  private async onError(error: any) {}

  private async onFinalMessage(
    message: any,
    historyId: string,
    completion: any[],
  ) {
    const history = await this.historyService.getHistoryById(historyId);

    // fix this to append to the last message if it is an assistant message
    if (
      history.chatHistory[history.chatHistory.length - 1].role === 'assistant'
    ) {
      const filterMessage = message.content.filter((c) => c.text.trim() !== '');
      if (filterMessage.length > 0) {
        history.chatHistory[history.chatHistory.length - 1] = {
          ...message,
          content: [
            ...history.chatHistory[history.chatHistory.length - 1].content,
            ...message.content,
          ],
        };
      }
    } else {
      history.chatHistory.push(message);
    }

    await this.historyService.updateHistory(historyId, history);

    if (message.stop_reason === 'stop_sequence') {
      if (message.stop_sequence === '<thinking>') {
        completion.push(message);
      } else if (message.stop_sequence === '</thinking>') {
      } else if (message.stop_sequence === '<tool_search_query>') {
      } else if (message.stop_sequence === '</tool_search_query>') {
      } else {
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
    }
  }

  private async onEnd() {}

  private async onStreamEvent(
    event: MessageDeltaEvent | MessageStopEvent,
    snapshot: any,
    system: string,
    max_tokens: number,
    token: string,
    historyId: string,
    shouldRecurse: boolean,
    observer: Subscriber<any>,
    completion: any[],
  ) {
    if (event.type === 'message_stop') {
      this.logger.log('Message stop event', event, snapshot);
    }
    const retrieved = await this.historyService.getHistoryById(historyId);

    observer.next({ data: event });

    // Consider storing event details in messages if necessary
    // messages.push(event); // Append the new event to the conversation history

    if ((event as MessageDeltaEvent)?.delta?.stop_reason === 'stop_sequence') {
      this.logger.log('Stop sequence event', event);
      const continueStreaming = await this.handleStopConditions(
        event as MessageDeltaEvent,
        system,
        snapshot,
        token,
        historyId,
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
        return await this.recurseStream(
          system,
          max_tokens,
          completion,
          historyId,
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
    completion: any[],
    historyId: string,
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
    this.logger.log('Recursing stream', completion);
    const retrieved =
      await this.historyService.getStreamAbleHistoryById(historyId);

    try {
      this.logger.log('Running prompt streaming');

      await this.anthropicService.runPromptStreaming(
        system,
        max_tokens,
        retrieved.chatHistory as MessageParam[],
        {
          onConnect: onConnect,
          onError: onError,
          onFinalMessage: onFinalMessage,
          onStreamEvent: onStreamEvent,
          onEnd: onEnd,
        },
      );
    } catch (error) {
      console.log('Error running prompt streaming', error);
      observer?.error(error);
    }
  }

  // Assume handleStopConditions and handleStopSequence remain the same

  private async handleStopConditions(
    event: MessageDeltaEvent,
    system: string,
    snapshot: any,
    token: string,
    historyId: string,
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
    const retrieved = await this.historyService.getHistoryById(historyId);
    // if (event.delta.stop_reason === 'stop_sequence') {

    switch (event.delta.stop_reason) {
      case 'stop_sequence':
        return await this.handleStopSequence(
          event,
          system,
          snapshot,
          token,
          historyId,
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
    snapshot: any,
    token: string,
    historyId: string,
  ): Promise<boolean> {
    try {
      const retrieved = await this.historyService.getHistoryById(historyId);

      switch (event.delta.stop_sequence) {
        case '<thinking>':
          // these should not be cast to the observer but they should be included in the message thread
          if (
            retrieved.chatHistory[retrieved.chatHistory.length - 1]?.role ===
            'assistant'
          ) {
            retrieved.chatHistory[
              retrieved.chatHistory.length - 1
            ].content.push({
              type: 'text',
              text: '<thinking>',
            });
          } else {
            retrieved.chatHistory.push({
              role: 'assistant',
              content: [
                {
                  type: 'text',
                  text: '<thinking>',
                },
              ],
            });
          }

          await this.historyService.updateHistory(historyId, retrieved);

          return true; // Return true to indicate the stream should continue
        case '</thinking>':
          const thinkHist = await this.historyService.getHistoryById(historyId);

          thinkHist.chatHistory[thinkHist.chatHistory.length - 1].content.push({
            type: 'text',
            text: '</thinking>',
          });

          const updated = await this.historyService.updateHistory(
            historyId,
            thinkHist,
          );

          return true; // Return true to indicate the stream should continue
        case '<tool_search_query>':
          const hist = await this.historyService.getHistoryById(historyId);

          // filter empty snapshot
          snapshot.content = snapshot.content.filter(
            (c) => c.text.trim() !== '',
          );

          if (snapshot.content.length === 0) {
            if (
              hist.chatHistory[hist.chatHistory.length - 1].role === 'assistant'
            ) {
              hist.chatHistory[hist.chatHistory.length - 1].content.push({
                type: 'text',
                text: '<tool_search_query>',
              });
            } else {
              hist.chatHistory.push({
                role: 'assistant',
                content: [
                  {
                    type: 'text',
                    text: '<tool_search_query>',
                  },
                ],
              });
            }
          } else {
            if (
              hist.chatHistory[hist.chatHistory.length - 1].role === 'assistant'
            ) {
              hist.chatHistory[hist.chatHistory.length - 1].content.push(
                ...snapshot.content,
                {
                  type: 'text',
                  text: '<tool_search_query>',
                },
              );
            } else {
              hist.chatHistory.push({
                role: 'assistant',
                content: [
                  ...snapshot.content,
                  {
                    type: 'text',
                    text: '<tool_search_query>',
                  },
                ],
              });
            }
          }

          await this.historyService.updateHistory(historyId, hist);

          return true; // Return true to indicate the stream should continue
        case '</tool_search_query>':
          if (
            retrieved.chatHistory[retrieved.chatHistory.length - 1].role ===
            'assistant'
          ) {
            retrieved.chatHistory[
              retrieved.chatHistory.length - 1
            ].content.push({
              type: 'text',
              text: '</tool_search_query>',
            });
          } else {
            retrieved.chatHistory.push({
              role: 'assistant',
              content: [
                {
                  type: 'text',
                  text: snapshot.content[0].text.trim(),
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

          let tool_msgs: ToolsBetaMessageParam[] = [
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

          retrieved.chatHistory.push(...(tool_msgs as ChatMessageType[]));

          const saved = await this.historyService.updateHistory(
            historyId,
            retrieved,
          );

          let tool_response =
            await this.anthropicService.runPromptWithToolsNonStreaming(
              system,
              2000,
              saved.chatHistory as unknown as ToolsBetaMessageParam[],
              tools as Tool[],
              [],
            );

          if (
            saved.chatHistory[saved.chatHistory.length - 1].role === 'assistant'
          ) {
            saved.chatHistory[saved.chatHistory.length - 1].content.push(
              ...(tool_response.content as unknown as TextBlockParam[]),
            );
          }

          await this.historyService.updateHistory(historyId, saved);

          while (tool_response.stop_reason === 'tool_use') {
            tool_msgs = [];
            tool_msgs.push({
              role: 'assistant',
              content: tool_response.content as (
                | TextBlockParam
                | ToolUseBlock
              )[],
            });

            console.log('TOOTLS RESPONSE', tool_response);

            const responses = await this.actionService.routeFunctionCalls(
              tool_response.content[1],
              token,
            );

            console.log(`Tool response: ${JSON.stringify(responses, null, 2)}`);

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

            const uHist = await this.historyService
              .updateHistory(historyId, {
                chatHistory: [
                  ...(retrieved.chatHistory as ChatMessageType[]),
                  ...(tool_msgs as ChatMessageType[]),
                ],
              })
              .then((h) =>
                h.chatHistory.map((c) => {
                  return {
                    role: c.role,
                    content: c.content,
                  };
                }),
              );

            tool_response =
              await this.anthropicService.runPromptWithToolsNonStreaming(
                system,
                2000,
                uHist as unknown[] as ToolsBetaMessageParam[],
                tools as Tool[],
                [],
              );

            if (uHist[uHist.length - 1].role === 'assistant') {
              uHist[uHist.length - 1].content.push(
                ...(tool_response.content as unknown as TextBlockParam[]),
              );
            } else {
              uHist.push({
                role: 'assistant',
                content: tool_response.content as TextBlockParam[],
              });
            }

            await this.historyService.updateHistory(historyId, {
              chatHistory: uHist as ChatMessageType[],
            });

            console.log('DONE RESPONSE', tool_response);
          }
          return true;
        default:
          console.log('default stop sequence', event.delta.stop_sequence);
          return false; // Default to not continuing the recursion for unhandled cases
      }
    } catch (error) {
      console.log('Error in handleStopSequence', error);
    }
  }
}
