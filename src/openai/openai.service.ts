import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import OpenAI from 'openai';
import { sleep } from 'openai/core';
import { AssistantStream } from 'openai/lib/AssistantStream';
import { Observable, Subscriber } from 'rxjs';
import { AssistantService } from 'src/assistant/assistant.service';
import { ToolOutputDocument } from 'src/db/schemas/ToolOutput';
import tools, { frontend_tools } from 'src/tool_json';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;
  private assistant: any;
  private thread: any;
  private run: any;
  private observer: Subscriber<any>;

  constructor(
    @InjectModel('ToolOutput')
    private toolOutputModel: Model<ToolOutputDocument>,
    private readonly assistantService: AssistantService,
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
        Domain Of Expertise: Quickbooks Query Assistant. 


        Tools:
        1. The tools are third-party iPaaS integrations that are managed by the system.
        2. You can use the tools to complete the task effectively.
        3. No credentials or API keys are required to use any tools.
        4. Assumption of data is allowed however, confirm and verify the data before using it. Ensure the user is aware of the assumption.

        Additionally, do not say things like: 
        "It appears that there is a persistent issue while fetching customer data from ZXY. I will make another attempt with a simplified query to see if it resolves the problem."
        "I will try to fetch the data from the tool again."
        "I will attempt to fetch the data from the tool again."
        
        These things are not allowed because they are not actionable steps. Instead, you should say things like: 
        "One moment. Still looking for the data."  

        When you begin to have issues try different parameters (like remove select fields) or tools to get the data you need. 
        Do not alert the user that you are having issues. Try it 2 times then alert the user that you are having issues.

        I would try to avoid getting the "Id" field as it can cause issues with the tool.

        Data Visualization:
        Use the display chart tool to render data as much as possible so that the user can see it in a better format.

        Briefly respond to the user before calling a tool so they are aware of what is happening.

        ===== Additional Information =====
        `,
      name: 'Morrigu',
      tools: tools as any,
      // model: 'gpt-4-turbo',
      model: 'gpt-4',
      // file_ids: ['file-abc123', 'file-abc456'],
    });
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
    slackFn?: (message) => Promise<void>,
  ) {
    try {
      const result = await this.openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: message,
      });

      return result;
    } catch (error) {
      try {
        const runs = await this.openai.beta.threads.runs.list(threadId);

        for (const run of runs.data) {
          if (run.status !== 'completed') {
            console.log('run', run);
            await this.handleEvent(
              run,
              'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoib2F1dGgiLCJuYW1lIjoiSmFzb24gU3QuIEN5ciIsImVtYWlsIjoiamFzb25AbW9ycmlndS5haSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKM01yOEhINGFJNURfSE1Oak9LWTd4UmV2OWV3NHNtbU5GbnNET0NhMDRodFk5aGc9czk2LWMiLCJwcm92aWRlckFjY291bnRJZCI6Imdvb2dsZS1vYXV0aDJ8MTE4MzgyNDc2ODAyNjY5NTQ5ODU4IiwicHJvdmlkZXIiOiJhdXRoMCIsImdpdmVuX25hbWUiOiJKYXNvbiIsImZhbWlseV9uYW1lIjoiU3QuIEN5ciIsImxvY2FsZSI6ImVuIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuaWNrbmFtZSI6Imphc29uIiwidXBkYXRlZEF0IjoiMjAyNC0wNC0wOFQwMzo1Njo1Mi4wMDlaIiwiaW1hZ2UiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKM01yOEhINGFJNURfSE1Oak9LWTd4UmV2OWV3NHNtbU5GbnNET0NhMDRodFk5aGc9czk2LWMiLCJ1c2VyX2lkIjoiZ29vZ2xlLW9hdXRoMnwxMTgzODI0NzY4MDI2Njk1NDk4NTgiLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExODM4MjQ3NjgwMjY2OTU0OTg1OCIsImV4cCI6MTcxMzEzOTIxMSwiaWF0IjoxNzEzMTM1NTgxfQ.ZyGsbIZhV73L4bvqYHzYnt9T04SHpax4el7cJfBZsmpMjKRnqEG1Xi2mn_yDB0GDlDrOAjDk1rAVzNbRfC4C7mfhIdOpevgCcmjJunT-Xn4MZrP1yBZ97nTWz-AeZW6mv_W0xsguMYPIbjlXcRFinxC-L_AVowtPz4Cq5bnTSETqxKxMn6zBRyGnXIYrkKI69vnYowouh4zVoq_MTh0AmaTiBg5ZFIz30bqjbnQq6V10DNF3pcealSTvsTq65eaQufsypzD4KeMgsy9n6nZS6XKdVSy4sud4Vb7xCS8lCWQUrA0PC-1255_XZ5t_HaAZhrkVilQuhEBvfN-mRQ9QyDhNAOxmTGHS_FLIGgaV7AweDxQvp76azAh2H0xedmBkY-5hKbCv3NJITbuw__6SYJH_i1XH3sk06yCCTQV506FifrEpf4eteE-pfrkt1_WGmi08JaNHpWlLIqJTp_qF17x2HZC22HNCr6OB5RVSt9UsrVaUZ-KsKlAyp9i_jEE0p45VHpZ8hMnSyL7i4Xv7LIC2RR3ZFU_ro20rnW3XUgFIdvs_9vIpxlXK4QsD1y0P2pu6ClPyWTjarGRAizdEGlbfEWC-JLhR7BaVTnP7XSWNWbUvGGA0DvxyAr79zQ7kytMtVebPjL0f0dReg_asrnFbYFnYlltSYUSLR-I7E_k',
              slackFn,
            );
          }
        }
      } catch (error) {
        console.error('Error adding message to thread', error);
      }
    }
  }

  // public async submitToolOutputs(event: AssistantStreamEvent) {
  //   return this.openai.beta.threads.runs;
  // }

  public async get_call_results(calls: any, token) {
    try {
      return await Promise.all(
        calls.map(async (call) => {
          console.log(JSON.parse(call.function.arguments));

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

  public async streamToolOutput(
    threadId: string,
    token: string,
    observer: any,
  ) {
    this.observer = observer;
    return this.openai.beta.threads.runs
      .stream(threadId, {
        assistant_id: process.env.DEFAULT_ASSISTANT,
      })
      .on('toolCallDone', this.handleToolCallDone)
      .on('toolCallDelta', this.handleToolCallDelta)
      .on('event', (event) => this.handleEvent(event, token))
      .on('toolCallCreated', this.handleToolCallCreated)
      .on('textCreated', this.handleTextCreated)
      .on('textDelta', this.handleTextDelta)
      .on('runStepCreated', this.handleRunStepCreated);
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

  public getCurrentRun = async (threadId: string) => {
    return await this.openai.beta.threads.runs
      .list(threadId, {
        limit: 1,
      })
      .then((runs) => {
        return runs.data[0];
      });
  };

  public handleEvent = async (
    event,
    token,
    slackFn?: (message) => Promise<void>,
  ) => {
    this.observer?.next({ event: 'event', data: event });

    if (event.data?.status === 'completed') {
      this.updateFrontEndStatus(event.data?.status);
    }

    if (event.data?.status === 'requires_action') {
      this.updateFrontEndStatus(event.data?.status);
      console.log('event', event.data);
      if (event.data?.required_action?.type === 'submit_tool_outputs') {
        const calls =
          event.data?.required_action?.submit_tool_outputs.tool_calls;

        try {
          console.log('calls', calls);

          const frontend_tools_names = frontend_tools
            .filter((tool) => tool.type === 'function')
            .map((tool) => tool.function.name);

          if (frontend_tools_names.includes(calls[0].function.name)) {
            this.observer?.next({
              type: 'frontend_tool_call',
              data: {
                calls: calls,
                runId: event.data.id,
              },
            });

            await sleep(2000);

            this.openai.beta.threads.runs
              .stream(event.data.thread_id, {
                assistant_id: process.env.DEFAULT_ASSISTANT,
              })
              .on('textCreated', this.handleTextCreated)
              .on('textDelta', this.handleTextDelta)
              .on('runStepCreated', this.handleRunStepCreated)
              .on('event', (event) => this.handleEvent(event, token, slackFn))
              .on('toolCallCreated', this.handleToolCallCreated)
              .on('toolCallDone', this.handleToolCallDone)
              .on('toolCallDelta', this.handleToolCallDelta)
              .on('textDone', async (text) => {
                await slackFn?.(text.value);
              })
              .on('error', async (error) => {
                console.log('Error running stream', error);
                const runs = await this.openai.beta.threads.runs.list(
                  event.data.thread_id,
                );

                for (const run of runs.data) {
                  if (run.status !== 'completed') {
                    await this.handleEvent(run, token, slackFn);
                  }
                }
              });
          } else {
            const call_results = await this.get_call_results(calls, token);

            console.log('call_results', JSON.stringify(call_results, null, 1));

            return this.openai.beta.threads.runs
              .submitToolOutputsStream(event.data.thread_id, event.data.id, {
                tool_outputs: call_results,
              })

              .on('toolCallDone', this.handleToolCallDone)
              .on('toolCallDelta', this.handleToolCallDelta)
              .on('event', (event) => this.handleEvent(event, token, slackFn))
              .on('toolCallCreated', this.handleToolCallCreated)
              .on('textCreated', this.handleTextCreated)
              .on('textDelta', this.handleTextDelta)
              .on('runStepCreated', this.handleRunStepCreated)
              .on('textDone', async (text) => {
                console.log('textDone', text.value);
                console.log('slackFn', slackFn);
                await slackFn?.(text.value);
              })
              .on('end', () => {
                this.observer?.next({ event: 'streamEnded' });
                this.observer?.complete();
              })
              .on('error', (error) => {
                console.log('Error handling event', error);
              });
          }

          // if (
          //   frontend_tools
          //     .map((tool) => tool.function.name)
          //     .includes(call.function.name)
          // ) {
          //   this.observer?.next({
          //     event: call.function.name,
          //     data: call.function.arguments,
          //   });

          // }
        } catch (error) {
          console.error('Error handling event', error);
        }
      }
    }
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

        // const toolOut = JSON.parse(
        //   (
        //     await this.toolOutputModel.findOne({
        //       _id: message.metadata['tool_outputs'],
        //     })
        //   ).data,
        // );

        message.metadata['tool_outputs'] = toolOut;
      }
    }

    return messages;
  };

  public runStreamSlack(
    threadId: string,
    token: string,
    slackFn?: (message) => Promise<void>,
  ) {
    return (
      this.openai.beta.threads.runs
        .stream(threadId, {
          assistant_id: process.env.DEFAULT_ASSISTANT,
        })
        .on('messageCreated', this.handleMessage)
        .on('runStepDone', this.handleRunStepDone)
        .on('textCreated', this.handleTextCreated)
        .on('textDelta', this.handleTextDelta)
        .on('runStepCreated', this.handleRunStepCreated)
        // .on('event', (event) => this.handleEvent(event, token, slackFn))
        // .on('event', this.handleEventv2)
        .on('toolCallCreated', this.handleToolCallCreated)
        .on('toolCallDone', this.handleToolCallDone)
        .on('toolCallDelta', this.handleToolCallDelta)
        .on('textDone', async (text) => {
          await slackFn?.(text.value);
        })
        .on('error', async (error) => {
          const runs = await this.openai.beta.threads.runs.list(threadId);

          for (const run of runs.data) {
            if (run.status !== 'completed') {
              await this.handleEvent(run, token, slackFn);
            }
          }
        })
    );
  }

  public async runStream(
    threadId: string,
    token: string,
    slackFn?: (message) => Promise<void>,
  ): Promise<AssistantStream> {
    return await this.openai.beta.threads.runs
      .stream(threadId, {
        assistant_id: process.env.DEFAULT_ASSISTANT,
      })
      .on('textCreated', this.handleTextCreated)
      .on('textDelta', this.handleTextDelta)
      .on('runStepCreated', this.handleRunStepCreated)
      .on('event', (event) => this.handleEvent(event, token, slackFn))
      .on('toolCallCreated', this.handleToolCallCreated)
      .on('toolCallDone', this.handleToolCallDone)
      .on('toolCallDelta', this.handleToolCallDelta);
  }

  public async recoverRun(threadId: string, runId: string) {
    return this.openai.beta.threads.runs.retrieve(threadId, runId);
  }

  public updateFrontEndStatus = (status: string) => {
    this.observer?.next({
      type: 'update_status',
      data: {
        status: status,
      },
    });
  };

  public handleToolCallCreated = async (toolCall: any) => {
    this.updateFrontEndStatus('calling tool');
  };

  public handleToolCallDone = async (toolCall: any) => {
    this.updateFrontEndStatus('done calling tool');
  };

  public handleToolCallDelta = async (toolCallDelta: any, snapshot: any) => {};

  public handleMessage = async (message: any) => {
    this.updateFrontEndStatus('creating');
  };

  public handleTextDelta = async (textDelta: any, snapshot: any) => {};

  public handleRunStepCreated = async (runStep: any) => {};

  public handleRunStepDone = async (runStep: any) => {};

  public handleEventv2 = async (event: any, token: string) => {
    console.log('event', event.event);
    if (event.event === 'thread.run.completed') {
      this.observer?.next({
        type: 'closeStream',
        data: event.data,
      });
      return;
    }
    if (event.event === 'thread.run.requires_action') {
      console.log('thread.run.requires_action', event.data);
      if (event.data?.required_action?.type === 'submit_tool_outputs') {
        const calls =
          event.data?.required_action?.submit_tool_outputs.tool_calls;

        try {
          console.log('calls', calls);

          const frontend_tools_names = frontend_tools
            .filter((tool) => tool.type === 'function')
            .map((tool) => tool.function.name);
          let call_results = [];
          if (frontend_tools_names.includes(calls[0].function.name)) {
            this.updateFrontEndStatus('displaying');
            this.observer?.next({
              type: 'frontend_tool_call',
              data: {
                calls: calls,
                runId: event.data.id,
              },
            });
            this.updateFrontEndStatus('saving');
            await this.toolOutputModel.create({
              runId: event.data.id,
              data: event.data,
            });
            this.updateFrontEndStatus('saved');
            call_results = calls.map((call) => {
              return {
                tool_call_id: call.id,
                output: 'Displayed in frontend successfully',
              };
            });
          } else {
            call_results = await this.get_call_results(calls, token);
          }
          this.updateFrontEndStatus('submitting');
          this.openai.beta.threads.runs
            .submitToolOutputsStream(event.data.thread_id, event.data.id, {
              tool_outputs: call_results,
            })
            .on('abort', this.hndleAbort)
            .on('connect', this.handleConnect)
            .on('end', this.handleEnd)
            .on('error', this.handleError)
            .on('event', (event) => this.handleEventv2(event, token))
            .on('imageFileDone', this.handleImageFileDone)
            .on('messageCreated', this.handleMessage)
            .on('messageDelta', this.handleMessageDelta)
            .on('messageDone', this.handleMessageDone)
            .on('run', this.handleRun)
            .on('runStepCreated', this.handleRunStepCreated)
            .on('runStepDelta', this.handleRunStepDelta)
            .on('runStepDone', this.handleRunStepDone)
            .on('textCreated', this.handleTextCreated)
            .on('textDelta', this.handleTextDelta)
            .on('textDone', this.handleTextDone)
            .on('toolCallCreated', this.handleToolCallCreated)
            .on('toolCallDone', this.handleToolCallDone)
            .on('toolCallDelta', this.handleToolCallDelta);
        } catch (error) {
          console.error('Error handling event', error);
        }
      }
    }
  };

  public hndleAbort = async (event: any) => {
    this.updateFrontEndStatus('aborted');
    console.log('abort', event);
  };

  public handleConnect = async () => {
    this.updateFrontEndStatus('connected');
    console.log('connect');
  };

  public handleTextCreated = async (text: any) => {
    console.log('text created', text);
  };

  public handleRun = async (run: any) => {
    console.log('run', run);
  };

  public handleRunStepDelta = async (runStep: any) => {
    console.log('runStep delta', runStep);
  };

  public handleEnd = async () => {
    this.updateFrontEndStatus('finished');
    this.observer?.next({
      type: 'streamEnd',
      data: {},
    });
  };

  public handleError = async (error: any) => {
    // console.log('error', error);
    this.updateFrontEndStatus('error');
  };

  public handleImageFileDone = async (imageFile: any) => {
    console.log('imageFile done', imageFile);
  };

  public handleMessageDelta = async (delta: any) => {
    this.updateFrontEndStatus('writing');
    this.observer?.next({
      type: 'messageDelta',
      data: delta,
    });
  };

  public handleMessageDone = async (message: any) => {
    const output = await this.toolOutputModel.findOne({
      runId: message.run_id,
      msgId: '',
    });

    console.log('output', output);

    if (!output) {
      this.updateFrontEndStatus('finished'); // not error just finished
      return;
    }
    this.updateFrontEndStatus('saving');
    await this.toolOutputModel.updateOne(
      {
        _id: output.id,
      },
      {
        msgId: message.id,
      },
    );
    this.updateFrontEndStatus('saving_message');
    await this.openai.beta.threads.messages
      .update(message.thread_id, message.id, {
        metadata: {
          tool_outputs: output.id,
        },
      })
      .then((value) => {
        this.observer?.next({
          type: 'refresh',
          data: value,
        });
      });
    this.updateFrontEndStatus('finished');
  };

  public handleTextDone = async (text: any) => {
    console.log('text done', text);
  };

  public async runAssistant(
    threadId,
    token,
    slackFn?: (message) => Promise<void>,
  ): Promise<[Observable<any>, Subscriber<any>]> {
    try {
      return [
        new Observable((observer) => {
          this.observer = observer;

          this.updateFrontEndStatus('running');

          this.openai.beta.threads.runs
            .stream(threadId, {
              assistant_id: this.assistantService.assistants.quickbooks.id,
            })
            .on('abort', this.hndleAbort)
            .on('connect', this.handleConnect)
            .on('end', this.handleEnd)
            .on('error', this.handleError)
            .on('event', (event) => this.handleEventv2(event, token))
            .on('imageFileDone', this.handleImageFileDone)
            .on('messageCreated', this.handleMessage)
            .on('messageDelta', this.handleMessageDelta)
            .on('messageDone', this.handleMessageDone)
            .on('run', this.handleRun)
            .on('runStepCreated', this.handleRunStepCreated)
            .on('runStepDelta', this.handleRunStepDelta)
            .on('runStepDone', this.handleRunStepDone)
            .on('textCreated', this.handleTextCreated)
            .on('textDelta', this.handleTextDelta)
            .on('textDone', this.handleTextDone)
            .on('toolCallCreated', this.handleToolCallCreated)
            .on('toolCallDone', this.handleToolCallDone)
            .on('toolCallDelta', this.handleToolCallDelta);
        }),
        this.observer,
      ];
    } catch (error) {
      console.error('Error running assistant', error);
    }
  }
}
