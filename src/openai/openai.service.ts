import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import OpenAI from 'openai';
import { Observable, Subscriber } from 'rxjs';
import { AssistantService } from 'src/assistant/assistant.service';
import { ToolOutputDocument } from 'src/db/schemas/ToolOutput';
import { OrganizationService } from 'src/organization/organization.service';
import tools, { frontend_tools } from 'src/tool_json';
import * as jwt from 'jsonwebtoken';
import { UserDocument } from 'src/db/schemas/User';
import { OrganizationDocument } from 'src/db/schemas/Organization';
import { promises as fsPromises } from 'fs';
import { MessageCreateParams } from 'openai/resources/beta/threads/messages';
import { uniqueId } from 'lodash';
import { createReadStream } from 'fs';
import { KnowledgeBaseDocument } from 'src/db/schemas/KnowledgeBase';
import * as yup from 'yup';
import { AgentDocument } from 'src/db/schemas/Agent';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;
  private assistant: any;
  private thread: any;
  private run: any;

  constructor(
    @InjectModel('ToolOutput')
    private toolOutputModel: Model<ToolOutputDocument>,
    @InjectModel('User')
    private readonly UserModel: Model<UserDocument>,
    @InjectModel('Organization')
    private readonly organizationModel: Model<OrganizationDocument>,

    @InjectModel('KnowledgeBase')
    private readonly knowledgeBaseModel: Model<KnowledgeBaseDocument>,

    @InjectModel('Agent')
    private readonly agentModel: Model<AgentDocument>,

    private readonly assistantService: AssistantService,
    private readonly organizationService: OrganizationService,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.openai.beta.assistants.update(process.env.DEFAULT_ASSISTANT, {
      instructions: `
        ===== Assistant Interface =====
        AI Name: Morrigu
        Made By: Morrigu AI, Inc.
        Version: 1.0
        Current Date: ${new Date().toDateString()}
        Current Time: ${new Date().toLocaleTimeString()}

        You exist to help me with my tasks. You are deeply integration with an iPaaS system that allows me to use tools to complete tasks effectively.

        Here how you will respond and interact with the user: 

        Step 1. You will receive a message from the user.
        Step 2. You will briefly respond to the user with how you are going to solve the problem.
        Step 3. You will ask the user for more information if needed.
        Step 4. Given the nature of the request you will use the search tool function to find the tool needed.
        Step 5. Once you receive the tool from the search tool function you will invoke the tool with the payload.

        Keep this concise and to the point so that you can solve the problems fast and effienctly.

        ===== Additional Information =====

        You are kind and professional. You are here to be a business assistant who handles the SaaS integrations effortlessly.

        Before you tell a user you dont have the ability to do something search for a few tools that can help you solve the problem. You must abide by this rule.
        `,
      name: 'Morrigu',
      tools: tools as any,
      model: 'gpt-4-turbo',
      // model: 'gpt-4',
      // file_ids: ['file-abc123', 'file-abc456'],
    });
  }

  async generateToken(userId: string) {
    try {
      console.log('userId', userId);

      const privateKey = process.env.PARAGON_KEY?.slice(1, -1).replace(
        /\\n/g,
        '\n',
      );
      const user = await this.UserModel.findOne({ id: userId });

      if (!user) {
        return {
          error: 'User not found',
        };
      }

      console.log('user', user);

      const org = await this.organizationModel.findOne({
        users: {
          $in: [user?._id],
        },
      });

      if (!org) {
        return {
          error: 'Organization not found',
        };
      }

      //   // Generate JWT token
      const token = jwt.sign(
        {
          ...{
            user: {
              user_id: userId,
            },
          },
          providerAccountId: userId,
          sub: org._id,
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
          iat: Math.floor(Date.now() / 1000) - 30,
        },
        privateKey as string,
        {
          algorithm: 'RS256',
        },
      );

      return token;
    } catch (error) {
      console.log(error);
      return {
        error: 'Failed to generate JWT token',
      };
    }
  }

  public async initAssistant() {
    this.assistant = await this.openai.beta.assistants.retrieve(
      process.env.DEFAULT_ASSISTANT,
    );
    await this.getNewThread();
    return {
      assistant: this.assistant,
      thread: this.thread,
    };
  }

  public async getNewRun(threadId: string) {
    this.run = await this.openai.beta.threads.runs.create(threadId, {
      assistant_id: process.env.DEFAULT_ASSISTANT,
    });
    return this.run;
  }

  public async getNewThread() {
    this.thread = await this.openai.beta.threads.create();
    return this.thread;
  }

  public async addMessageToThread(
    threadId: string,
    message: string,
    attachments?: (MessageCreateParams.Attachment & {
      s3_url?: string;
    })[],
  ) {
    try {
      const image_meta_file_ids = {};

      for (const attachment of attachments || []) {
        if (attachment.s3_url) {
          image_meta_file_ids[attachment.file_id] = attachment.s3_url;
        }
      }

      console.log('image_meta_file_ids', image_meta_file_ids);

      const result = await this.openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: message,
        attachments: attachments.map((attachment) => {
          return {
            file_id: attachment.file_id,
            tools: [{ type: 'code_interpreter' }],
          };
        }),
        metadata: {
          ...image_meta_file_ids,
        },
      });

      return result;
    } catch (error) {
      console.error('Error adding message to thread', error);
    }
  }

  public async uploadFiles(files: any) {
    const result = await this.openai.files.create({
      file: files,
      purpose: 'assistants',
    });
  }

  public async uploadBase64Image(
    file: {
      name: string;
      url: string; // Base64 encoded data
    },
    purpose: 'fine-tune' | 'assistants',
  ) {
    // Decode the base64 URL to binary buffer
    const base64Data = file.url.split(';base64,').pop();
    if (!base64Data) {
      throw new Error('Invalid base64 data');
    }
    const buffer = Buffer.from(base64Data, 'base64');

    // Write the buffer to a temporary file
    const tempFilePath = `./${uniqueId()}_${file.name}`;
    await fsPromises.writeFile(tempFilePath, buffer);

    try {
      // Create a read stream from the file
      const readStream = createReadStream(tempFilePath);

      // Upload the file using the OpenAI SDK
      const response = await this.openai.files.create({
        file: readStream,
        purpose: purpose,
      });

      console.log('File uploaded:', response);
      return response;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    } finally {
      // Clean up the temporary file
      await fsPromises.unlink(tempFilePath);
    }
  }

  public async get_call_results(calls: any, token) {
    try {
      return await Promise.all(
        calls.map(async (call) => {
          const q = new URLSearchParams({
            payload: JSON.stringify(call.function.arguments),
          }).toString();

          const callResp = await fetch(
            `${process.env.BACKEND_API_URL}/api/tools/` +
              call.function.name +
              '?' +
              q,
            {
              method: 'GET',
              headers: {
                Authorization:
                  'Bearer ' + !token.includes('Bearer')
                    ? token
                    : token.split(' ')[1],
                'Content-Type': 'application/json',
              },
            },
          );

          const callRespJson = await callResp.json();

          return {
            tool_call_id: call.id,
            output: JSON.stringify(callRespJson, null, 1),
          };
        }),
      );
    } catch (error) {
      console.error('Error getting call results', error);
    }
  }

  public submitToolOutputs = async (
    outputs: any,
    threadId: string,
    runId: string,
  ) => {
    const stout = outputs.map((output) => {
      return {
        tool_call_id: output.id,
        output: JSON.stringify(output.out, null, 1),
      };
    });

    this.openai.beta.threads.runs.submitToolOutputs(threadId, runId, {
      tool_outputs: stout,
    });
  };

  /**
   * Description: Get the file by id from OpenAI API
   * @param fileId - The file id
   * @returns The file info and content from OpenAI API
   */
  public async getFile(fileId: string) {
    const fileInfo = await this.openai.files.retrieve(fileId);
    // const fileContent = await this.openai.files.content(fileId);

    return {
      fileInfo,
      // fileContent,
    };
  }

  /**
   * Description: Get the current run
   * @param threadId - The thread id
   * @returns The current run
   */
  public getCurrentRun = async (threadId: string) => {
    return await this.openai.beta.threads.runs
      .list(threadId, {
        limit: 1,
      })
      .then((runs) => {
        return runs.data[0];
      });
  };

  public getMessages = async (threadId: string) => {
    const messages = (await this.openai.beta.threads.messages.list(threadId))
      .data;

    for (const message of messages) {
      if (message.metadata['tool_outputs']) {
        const output = (await this.toolOutputModel.findOne({
          _id: message.metadata['tool_outputs'],
        })) as any;

        const toolOut =
          output.data.required_action.submit_tool_outputs.tool_calls.map(
            (call) => {
              // const formatted =
              call.function.arguments = JSON.parse(call.function.arguments);
              return call;
            },
          );

        message.metadata['tool_outputs'] = toolOut;
      }
    }

    return messages;
  };

  public async recoverRun(threadId: string, runId: string) {
    return this.openai.beta.threads.runs.retrieve(threadId, runId);
  }

  public updateFrontEndStatus = (status: string, observer) => {
    observer?.next({
      type: 'update_status',
      data: {
        status: status,
      },
    });
  };

  public handleToolCallCreated = (toolCall: any, observer) => {
    this.updateFrontEndStatus('calling tool', observer);
    return toolCall;
  };

  public handleToolCallDone = async (toolCall: any, observer) => {
    this.updateFrontEndStatus('done calling tool', observer);
  };

  public handleToolCallDelta = async (
    toolCallDelta: any,
    snapshot: any,
    observer,
  ) => {};

  public handleMessage = async (message: any, observer) => {
    this.updateFrontEndStatus('creating', observer);
  };

  public handleTextDelta = async (textDelta: any, observer) => {};

  public handleRunStepCreated = async (runStep: any, observer) => {
    return runStep;
  };

  public handleRunStepDone = async (
    runStep: any,
    snapshot,
    token,
    observer,
  ) => {
    try {
      const { providerAccountId } = jwt.decode(token) as any;

      const org =
        await this.organizationService.getOrganizationByUserId(
          providerAccountId,
        );

      org.usage = {
        prompt_tokens:
          ((
            org.usage as {
              prompt_tokens: number;
              completion_tokens: number;
              total_tokens: number;
            }
          ).prompt_tokens
            ? (org.usage as { prompt_tokens: number }).prompt_tokens
            : 0) + snapshot.usage.prompt_tokens,
        completion_tokens:
          ((
            org.usage as {
              prompt_tokens: number;
              completion_tokens: number;
              total_tokens: number;
            }
          ).completion_tokens
            ? (org.usage as { completion_tokens: number }).completion_tokens
            : 0) + snapshot.usage.completion_tokens,
        total_tokens:
          ((
            org.usage as {
              prompt_tokens: number;
              completion_tokens: number;
              total_tokens: number;
            }
          ).total_tokens
            ? (org.usage as { total_tokens: number }).total_tokens
            : 0) + snapshot.usage.total_tokens,
        request_time: snapshot.completed_at - snapshot.created_at,
      };

      const newOrg = await this.organizationService.updateOrganization(
        org.id,
        org,
      );
    } catch (error) {
      console.error('Error handling run step done', error);
    }
  };

  public handleEventv2 = async (event: any, token: string, observer) => {
    if (event.event === 'thread.run.completed') {
      observer?.next({
        type: 'closeStream',
        data: event.data,
      });
      return;
    }
    if (event.event === 'thread.run.requires_action') {
      if (event.data?.required_action?.type === 'submit_tool_outputs') {
        const calls =
          event.data?.required_action?.submit_tool_outputs.tool_calls;

        try {
          const frontend_tools_names = frontend_tools
            .filter((tool) => tool.type === 'function')
            .map((tool) => tool.function.name);
          let call_results = [];
          if (frontend_tools_names.includes(calls[0].function.name)) {
            this.updateFrontEndStatus('displaying', observer);
            observer?.next({
              type: 'frontend_tool_call',
              data: {
                calls: calls,
                runId: event.data.id,
              },
            });
            this.updateFrontEndStatus('saving', observer);
            await this.toolOutputModel.create({
              runId: event.data.id,
              data: event.data,
            });
            this.updateFrontEndStatus('saved', observer);
            call_results = calls.map((call) => {
              return {
                tool_call_id: call.id,
                output: 'Displayed in frontend successfully',
              };
            });
          } else {
            call_results = await this.get_call_results(calls, token);
          }
          this.updateFrontEndStatus('submitting', observer);

          this.openai.beta.threads.runs
            .submitToolOutputsStream(event.data.thread_id, event.data.id, {
              tool_outputs: call_results,
            })
            .on('abort', (event) => this.hndleAbort(event, observer))
            .on('connect', () => this.handleConnect(observer))
            .on('end', () => this.handleEnd(observer))
            .on('error', (error) => this.handleError(error, observer))
            .on('event', (event) => this.handleEventv2(event, token, observer))
            .on('imageFileDone', this.handleImageFileDone)
            .on('messageCreated', (message) =>
              this.handleMessage(message, observer),
            )
            .on('messageDelta', (delta) =>
              this.handleMessageDelta(delta, observer),
            )
            .on('messageDone', (message) =>
              this.handleMessageDone(message, observer),
            )
            .on('run', (run) => this.handleRun(run))
            .on('runStepCreated', (runStep) =>
              this.handleRunStepCreated(runStep, observer),
            )
            .on('runStepDelta', (runStep) =>
              this.handleRunStepDelta(runStep, observer),
            )
            .on('runStepDone', (runStep, snapshot) =>
              this.handleRunStepDone(runStep, snapshot, token, observer),
            )
            .on('textCreated', (text) => this.handleTextCreated(text))
            .on('textDelta', (delta) => this.handleTextDelta(delta, observer))
            .on('textDone', (text) => this.handleTextDone(text, observer))
            .on('toolCallCreated', (toolCall) =>
              this.handleToolCallCreated(toolCall, observer),
            )
            .on('toolCallDone', (toolCall) =>
              this.handleToolCallDone(toolCall, observer),
            )
            .on('toolCallDelta', (toolCallDelta, snapshot) =>
              this.handleToolCallDelta(toolCallDelta, snapshot, observer),
            );
        } catch (error) {
          console.error('Error handling event', error);
        }
      }
    }
  };

  public hndleAbort = async (event: any, observer) => {
    this.updateFrontEndStatus('aborted', observer);
  };

  public handleConnect = async (observer) => {
    this.updateFrontEndStatus('connected', observer);
  };

  public handleTextCreated = async (text: any) => {};

  public handleRun = async (run: any) => {};

  public handleRunStepDelta = async (runStep: any, observer) => {};

  public handleEnd = async (observer) => {
    this.updateFrontEndStatus('finished', observer);
    observer?.next({
      type: 'streamEnd',
      data: {},
    });
  };

  public handleError = async (error: any, observer) => {
    // console.log('error', error);
    this.updateFrontEndStatus('error', observer);
  };

  public handleImageFileDone = async (imageFile: any) => {
    console.log('imageFile done', imageFile);
  };

  public handleMessageDelta = async (delta: any, observer) => {
    this.updateFrontEndStatus('writing', observer);
    observer?.next({
      type: 'messageDelta',
      data: delta,
    });
  };

  public handleMessageDone = async (message: any, observer) => {
    const output = await this.toolOutputModel.findOne({
      runId: message.run_id,
      msgId: '',
    });

    if (!output) {
      this.updateFrontEndStatus('finished', observer);
      return;
    }
    this.updateFrontEndStatus('saving', observer);
    await this.toolOutputModel.updateOne(
      {
        _id: output.id,
      },
      {
        msgId: message.id,
      },
    );
    this.updateFrontEndStatus('saving_message', observer);
    await this.openai.beta.threads.messages
      .update(message.thread_id, message.id, {
        metadata: {
          tool_outputs: output.id,
        },
      })
      .then((value) => {
        observer?.next({
          type: 'refresh',
          data: value,
        });
      });
    this.updateFrontEndStatus('finished', observer);
  };

  public handleTextDone = async (text: any, observer) => {};

  public async runAssistant(
    threadId,
    token,
    assistantId = process.env.DEFAULT_ASSISTANT,
  ): Promise<[Observable<any>, Subscriber<any>]> {
    try {
      let innerObs;
      return [
        new Observable((observer) => {
          innerObs = observer;

          this.updateFrontEndStatus('running', observer);

          this.openai.beta.threads.runs
            .stream(threadId, {
              assistant_id: assistantId,
            })
            .on('abort', (event) => this.hndleAbort(event, observer))
            .on('connect', () => this.handleConnect(observer))
            .on('end', () => this.handleEnd(observer))
            .on('error', (error) => this.handleError(error, observer))
            .on('event', (event) => this.handleEventv2(event, token, observer))
            .on('imageFileDone', this.handleImageFileDone)
            .on('messageCreated', (message) =>
              this.handleMessage(message, observer),
            )
            .on('messageDelta', (delta) =>
              this.handleMessageDelta(delta, observer),
            )
            .on('messageDone', (message) =>
              this.handleMessageDone(message, observer),
            )
            .on('run', (run) => this.handleRun(run))
            .on('runStepCreated', (runStep) =>
              this.handleRunStepCreated(runStep, observer),
            )
            .on('runStepDelta', (runStep) =>
              this.handleRunStepDelta(runStep, observer),
            )
            .on('runStepDone', (runStep, snapshot) =>
              this.handleRunStepDone(runStep, snapshot, token, observer),
            )
            .on('textCreated', (text) => this.handleTextCreated(text))
            .on('textDelta', (delta) => this.handleTextDelta(delta, observer))
            .on('textDone', (text) => this.handleTextDone(text, observer))
            .on('toolCallCreated', (toolCall) =>
              this.handleToolCallCreated(toolCall, observer),
            )
            .on('toolCallDone', (toolCall) =>
              this.handleToolCallDone(toolCall, observer),
            )
            .on('toolCallDelta', (toolCallDelta, snapshot) =>
              this.handleToolCallDelta(toolCallDelta, snapshot, observer),
            );
        }),
        innerObs,
      ];
    } catch (error) {
      console.error('Error running assistant', error);
    }
  }

  // This Section below is for managing the knowledge base

  /**
   * Create a knowledge base in OpenAI
   * @param data - The data to create the knowledge base
   * @returns - The created knowledge base
   */
  public async createKnowledgeBase(data: any, owner: string): Promise<any> {
    try {
      const validation = yup.object().shape({
        name: yup.string(),
        file_ids: yup.array().of(yup.string()),
        expires_after: yup.object().shape({
          anchor: yup.string().oneOf(['last_active_at']),
          days: yup.number(),
        }),
        //  map type of single key-value pairs
        metadata: yup.object(),
      });

      const isValid = await validation.validate(data, {
        stripUnknown: true,
      });

      const vs = await this.openai.beta.vectorStores.create(data);

      console.log('vs', vs);

      const knowledgeBase = await this.knowledgeBaseModel.create({
        ...isValid,
        store_id: vs.id,
        owner,
      });

      return knowledgeBase;
    } catch (error) {
      if (error instanceof yup.ValidationError)
        return {
          error: error.message,
        };

      return {
        error: 'Error creating knowledge base',
      };
    }
  }

  /**
   * Get a knowledge base by id
   * @param id - The knowledge base id
   * @returns - The knowledge base
   */
  public async getKnowledgeBase(id: string, owner): Promise<any> {
    try {
      console.log('id', id, 'owner', owner);
      const knowledgeBase = await this.knowledgeBaseModel.findOne({
        _id: id,
        owner,
      });

      const vs = await this.openai.beta.vectorStores.retrieve(
        knowledgeBase.store_id,
      );

      return vs;
    } catch (error) {
      return {
        error: 'Error getting knowledge base',
      };
    }
  }

  /**
   * Get all knowledge bases
   * @returns - The list of knowledge bases
   */
  public async getKnowledgeBases(owner): Promise<any> {
    try {
      const knowledgeBases = await this.knowledgeBaseModel.find({
        owner: owner,
      });

      const all = [];

      for (const knowledgeBase of knowledgeBases) {
        console.log('knowledgeBase', knowledgeBase);
        const vs = await this.openai.beta.vectorStores.retrieve(
          knowledgeBase.store_id,
        );

        all.push(vs);
      }

      return all;
    } catch (error) {
      return {
        error: 'Error getting knowledge bases',
      };
    }
  }

  // ==== Agent Operations ====

  /**
   *
   * @param data
   * @param owner
   * @returns
   */
  public async createAgent(data: any): Promise<any> {
    try {
      const validation = yup.object().shape({
        name: yup.string().required(),
        owner: yup.string().required(),
        modelId: yup.string().required(),
      });

      const isValid = await validation.validate(data, {
        stripUnknown: true,
      });

      console.log('data', data);

      const { owner, modelId, ...rest } = isValid;

      const as = await this.openai.beta.assistants.create({
        ...rest,
        model: modelId,
      } as any);

      const agentCreate = await this.agentModel.create({
        ...isValid,
        agent_id: as.id,
        owner,
      });

      console.log('knowledgeBase', agentCreate);

      return agentCreate;
    } catch (error) {
      console.log('error', error);
      if (error instanceof yup.ValidationError)
        return {
          error: error.message,
        };

      return {
        error: 'Error creating agent',
      };
    }
  }

  /**
   *
   * @param agentId
   * @param owner
   * @returns
   */
  public async getAgent(agentId: string, owner: string): Promise<any> {
    try {
      const agent = await this.agentModel.findOne({
        _id: agentId,
        owner,
      });

      const as = await this.openai.beta.assistants.retrieve(agent.agent_id);

      return as;
    } catch (error) {
      return {
        error: 'Error getting agent',
      };
    }
  }

  /**
   *
   * @param owner
   * @returns
   */
  public async getAgents(owner: string): Promise<any> {
    try {
      const kbs = await this.agentModel.find({
        owner,
      });

      console.log(kbs);

      const all = [];

      for (const kb of kbs) {
        const as = await this.openai.beta.assistants.retrieve(kb.agent_id);

        all.push({
          ...kb.toObject(),
          ...as,
        });
      }

      return all;
    } catch (error) {
      return {
        error: 'Error getting agents',
      };
    }
  }

  /**
   *
   * @param agentId
   * @param data
   * @returns
   */
  public async updateAgent(agentId: string, data: any): Promise<any> {
    try {
      const validation = yup.object().shape({
        name: yup.string(),
        modelId: yup.string(),
      });

      const isValid = await validation.validate(data, {
        stripUnknown: true,
      });

      const agent = await this.agentModel.findOne({
        _id: agentId,
      });

      const as = await this.openai.beta.assistants.update(agent.agent_id, {
        ...isValid,
        model: isValid.modelId,
      });

      return as;
    } catch (error) {
      return {
        error: 'Error updating agent',
      };
    }
  }

  // ---- Managing Files ----

  /**
   * Upload a file to OpenAI
   * @param file - The file to upload
   * @param purpose - The purpose of the file
   * @returns - The uploaded file
   */
  public async uploadFile(
    file: File,
    purpose: 'fine-tune' | 'assistants',
  ): Promise<any> {
    try {
      const response = await this.openai.files.create({
        file,
        purpose,
      });

      return response;
    } catch (error) {
      return {
        error: 'Error uploading file',
      };
    }
  }

  /**
   * Get a file by id
   * @param fileId - The file id
   * @returns - The file
   */
  public async getFileById(fileId: string): Promise<any> {
    try {
      const file = await this.openai.files.retrieve(fileId);

      return file;
    } catch (error) {
      return {
        error: 'Error getting file',
      };
    }
  }

  /**
   * Get all files
   * @returns - The list of files
   */
  public async getFiles(): Promise<any> {
    try {
      const files = await this.openai.files.list();

      return files;
    } catch (error) {
      return {
        error: 'Error getting files',
      };
    }
  }

  /**
   * Delete a file by id
   * @param fileId - The file id
   * @returns - The deleted file
   */
  public async deleteFile(fileId: string): Promise<any> {
    try {
      // const file = await this.openai.files.delete(fileId);

      // return file;
      return [];
    } catch (error) {
      return {
        error: 'Error deleting file',
      };
    }
  }
}
