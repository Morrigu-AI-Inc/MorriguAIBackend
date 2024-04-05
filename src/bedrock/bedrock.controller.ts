import {
  Controller,
  Get,
  Header,
  Logger,
  Param,
  Query,
  Req,
  Sse,
} from '@nestjs/common';

import { BedrockService, MessageProp } from './bedrock.service';
import { Observable } from 'rxjs';
import * as yup from 'yup';

import { ActionsService } from 'src/actions/actions.service';
import { Xml2JsonServiceService } from 'src/xml2-json-service/xml2-json-service.service';
import {
  BuildPromptService,
  FunctionCallingInstructions,
} from 'src/tools/build_prompt/build_prompt.service';
import { PrompthistoryService } from 'src/prompthistory/prompthistory.service';
import { Types } from 'mongoose';
import { QueryResponseDocument } from 'src/db/schemas/QueryResponse';
import { QueryResponsePairDocument } from 'src/db/schemas/QueryResponsePair';
import { MediaService } from 'src/media/media.service';
import { ToolsService } from 'src/tools/tools.service';

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
  ) {}

  @Sse('InvokeStream/:featureId')
  @Get('InvokeStream/:featureId')
  @Header('Content-Type', 'text/event-stream')
  @Header('Cache-Control', 'no-cache, no-transform')
  @Header('Content-Encoding', 'none')
  @Header('Transfer-Encoding', 'chunked')
  async invokeStream(
    @Param('featureId') id: string,
    @Query('payload') payload: string,
    @Query('token') token: string,
  ): Promise<Observable<any>> {
    try {
      const validPayload = await validation.validate(
        { id: id?.[0], payload: JSON.parse(payload) },
        { abortEarly: false },
      );

      return new Observable((observer) => {
        this.bedrockService
          .InvokeModelWithResponseStream(
            JSON.stringify(validPayload.payload.body),
            validPayload.payload.modelId as string,
            validPayload.payload.historyId as string,
            {
              modelId: (validPayload.payload.model as string) || '',
              promptId: validPayload.payload.prompt as string | '',
            },
          )
          .then(async (stream) => {
            if (stream) {
              const { completion } =
                await this.bedrockService.resolveGeneration({
                  // this will be the recursive function
                  observer: observer,
                  stream,
                  completion: '',
                  messages: [],
                  token: token,
                });
            }
          })
          .catch((error) => {
            // Emit an error if something goes wrong
            this.logger.error('Error invoking stream inner', error);
            observer.error(error);
          });
      });

      // const flag = this.promptFlagService.findOne(validPayload.id as string, token);
    } catch (error) {
      this.logger.error('Error invoking stream', error);
    }
  }

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

    // For this we need to update the history with the query then pull the whole query and build the messages.

    try {
      const tasks = [
        // 'AI Readiness Assessment=====================\n\n',
        // 'Give an AI Readiness assessment to the user.',
        // '- What industry is their business in?',
        // '- What is the business goals and objectives for the nex 1-3 years?',
        // '- Has the business previously used AI or ML technologies?',
        // '- Does the business collect data digitally?',
        // '- What data does the business collect?',
        // '- How would the business rate the quality of their data?',
        // '- What technology infrastructure does the business have?',
        // '- Do you have in-house IT and data management support?',
        // '- What is the level of AI knowledge within the business?',
        // '- Does the team have the skills to implement AI technologies?',
        // '- Are you willing to invest in training and development or hiring?',
        // '- Are there any regulatory constraints on data usage in your industry or vertical?',
        // '- Do you have policies in place to ensure ethical use of AI technologies?',
        // '- What are the main challenges you anticipate in implementing AI technologies?',
        // '- What are the main benefits you expect from AI implementation?',
        // '- What specific areas of the business do you think AI could improve?',
        // 'When you are done with the assessment, provide the user with a summary of the results and recommendations.',
        // 'Submit the details of the report with the submit_assessment tool.',
      ];
      const persona =
        'Morrigu is a AI Chatbot created by Morrigu AI, Inc. that can give valuable insights on business intelligence, data analysis, and operational tasks.';

      const messageThread: MessageProp[] = messages.map((m) => {
        return {
          role: m.role,
          content: m.content,
        };
      });

      const prefilled =
        '<function_calls><invoke><tool_name>search_for_more_tools</tool_name><parameters><tool_search_query>';

      const functions = await this.bedrockService.InvokeModelWithStream(
        `
        Come up with a very good tool search query for the conversation.
        Write the function_calls block to get tools based on the conversation. Do not reflect on the conversation, just provide the tools.
        
        ${FunctionCallingInstructions}

        `,
        [
          ...messageThread,
          {
            role: 'assistant',
            content: [
              {
                type: 'text',
                text: prefilled,
              },
            ],
          },
        ],
        {
          stream: false,
          modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
        },
      );

      const xml =
        prefilled +
        JSON.parse(functions as string).content[0].text +
        '</function_calls>';
      const json = await this.xml2JsonService.convertXmlToJson(xml);

      console.log('json', json);

      const results = await this.actionService.routeFunctionCalls(
        json,
        validPayload.token,
      );

      const functionResults: {
        result: {
          tool_name: string;
          stdout: {
            tools: Array<{
              tool_name: string;
              description: string;
              parameters: {
                name: string;
                type: string;
                description: string;
                required: boolean;
                default: string;
              }[];
            }>;
          };
        };
      }[] = results.function_results;

      console.log('functionResults', functionResults);

      //  {
      // _id: '660dec296537ab5404f2dba6',
      // tool_name: 'pandadoc_get_document_status',
      // description: "This tool is designed to fetch basic data about a specific document from a PandaDoc account, including its name, status, and relevant dates. It is particularly useful for confirming the document's status to ensure it is in the expected state before proceeding with additional API methods. This capability is essential for managing document workflows efficiently, supporting both polling mechanisms and the integration with webhooks for event-driven needs as recommended by PandaDoc.",
      // parameters: [Array],
      // createdAt: '2024-04-03T23:54:17.764Z',
      // updatedAt: '2024-04-03T23:54:17.764Z',
      // __v: 0
      // }

      const foundTools = functionResults[0].result.stdout.tools.map((tool) => {
        return {
          tool_name: tool.tool_name,
          description: tool.description,
          parameters: tool.parameters,
        };
      });

      console.log('foundTools', foundTools);

      const systemPrompt = this.buildPromptService.buildPrompt({
        task: tasks,
        persona: persona,
        prompt:
          // 'Ask the user if they are ready to start the assessment then provide the user with the AI Readiness assessment question by question. When the user has sufficiently answered the question move on and ask the next question.',
          '',

        funcResults: '',
        context: '',
        tools: [...defaultTools, ...foundTools],
        includeThoughtLoop: true,
      }) as string;

      return new Observable((observer) => {
        // pre-start the conversation with the system prompt
        const initMessages: MessageProp[] = [...messageThread];
        this.bedrockService
          .InvokeModelWithStream(systemPrompt, initMessages, {
            stream: true,
            modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
          })
          .then(async (stream) => {
            if (typeof stream === 'string') {
            } else {
              console.log(initMessages[initMessages.length - 1]);
              const { completion } =
                await this.bedrockService.resolveGeneration({
                  observer: observer,
                  stream,
                  completion: '',
                  messages: [...initMessages],
                  system: systemPrompt,
                  tasks: tasks,

                  persona,
                  token: validPayload.token,
                });

              await this.historyService.appendResponseToHistory(
                validPayload.historyId,
                {
                  owner: new Types.ObjectId(),
                  body: {
                    text: completion || ' ',
                  },
                },
              ),
                observer.complete();
            }
          })
          .catch((error) => {
            // Emit an error if something goes wrong

            console.log('Error invoking stream inner', error);
            this.logger.error('Error invoking stream inner', error);
            observer.error(error);
          });
      });

      // const flag = this.promptFlagService.findOne(validPayload.id as string, token);
    } catch (error) {
      this.logger.error('Error invoking stream', error);
    }
  }
}
