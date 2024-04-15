import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { sleep } from 'openai/core';
import { AbstractAssistantStreamRunner } from 'openai/lib/AbstractAssistantStreamRunner';
import { AssistantStream } from 'openai/lib/AssistantStream';
import { AssistantStreamEvent } from 'openai/resources/beta/assistants/assistants';

import { Observable, Subscriber } from 'rxjs';
import tools from 'src/tool_json';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;
  private assistant: any;
  private thread: any;
  private run: any;
  private observer: Subscriber<any>;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.openai.beta.assistants.update('asst_os1O6Teplk4ldDH3SsRKst0p', {
      instructions: `
        ===== Assistant Interface =====
        AI Name: Morrigu
        Made By: Morrigu AI, Inc.
        Version: 1.0
        Current Date: ${new Date().toDateString()}
        Current Time: ${new Date().toLocaleTimeString()}
        Domain Of Expertise: Quickbooks Query Assistant.

        ===== System Information =====
        You have access to various IPaaS tools that can help you complete the task effectively. 

        These tools are managed by the system and do not require any credentials or API keys to use.

        Paragon is an integration platform that allows us to connect to different applications and services to automate workflows and data exchange. 
        You can use the integrated iPaaS internal system tools that leverages Paragon to complete the task effectively.
        When a tool errors continue trying to use the tool, the system will provide guidance on how to proceed.

        Rules:
        1. The tools are third-party iPaaS integrations that are managed by the system.
        2. You can use the tools to complete the task effectively.
        3. No credentials or API keys are required to use any tools.

        Additionally, do not say things like: 
        "It appears that there is a persistent issue while fetching customer data from ZXY. I will make another attempt with a simplified query to see if it resolves the problem."
        "I will try to fetch the data from the tool again."
        "I will attempt to fetch the data from the tool again."
        
        These things are not allowed because they are not actionable steps. Instead, you should say things like: 
        "One moment. Still looking for the data."  

        When you begin to have issues try different parameters (like remove select fields) or tools to get the data you need. 
        Do not alert the user that you are having issues. Try 10 times before giving up.

        I would try to avoid getting the "Id" field as it can cause issues with the tool.

        ===== Additional Information =====
        `,
      name: 'Morrigu',
      tools: tools as any,
      model: 'gpt-4',
      // file_ids: ['file-abc123', 'file-abc456'],
    });
  }

  public async initAssistant() {
    this.assistant = await this.openai.beta.assistants.retrieve(
      'asst_os1O6Teplk4ldDH3SsRKst0p',
    );
    await this.getNewThread();
    return {
      assistant: this.assistant,
      thread: this.thread,
    };
  }

  public async getNewRun(threadId: string) {
    this.run = await this.openai.beta.threads.runs.create(threadId, {
      assistant_id: 'asst_os1O6Teplk4ldDH3SsRKst0p',
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
  public handleTextCreated = async (text: any) => {
    this.observer?.next({ event: 'textCreated', data: text });
    return text;
  };

  public handleTextDelta = async (textDelta: any, snapshot: any) => {
    this.observer?.next({ event: 'textDelta', data: textDelta });
  };

  public handleRunStepCreated = async (runStep: any) => {
    this.observer?.next({ event: 'runStepCreated', data: runStep });
  };

  public async get_call_results(calls: any, token) {
    return await Promise.all(
      calls.map(async (call) => {
        console.log(JSON.parse(call.function.arguments));
        const q = new URLSearchParams(
          JSON.parse(call.function.arguments),
        ).toString();
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
  }

  public handleEvent = async (
    event,
    token,
    slackFn?: (message) => Promise<void>,
  ) => {
    this.observer?.next({ event: 'event', data: event });

    if (event.data?.status === 'completed') {
    }

    if (event.data?.status === 'requires_action') {
      if (event.data?.required_action?.type === 'submit_tool_outputs') {
        const calls =
          event.data?.required_action?.submit_tool_outputs.tool_calls;

        try {
          console.log('calls', calls);
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
        } catch (error) {
          console.error('Error handling event', error);
        }
      }
    }
  };

  public getMessages = async (threadId: string) => {
    return this.openai.beta.threads.messages.list(threadId);
  };

  public handleToolCallCreated = async (toolCall: any) => {
    this.observer?.next({ event: 'toolCallCreated', data: toolCall });
  };

  public handleToolCallDone = async (toolCall: any) => {
    this.observer?.next({ event: 'toolCallDone', data: toolCall });
  };

  public handleToolCallDelta = async (toolCallDelta: any, snapshot: any) => {
    this.observer?.next({ event: 'toolCallDelta', data: toolCallDelta });
  };

  public runStreamSlack(
    threadId: string,
    token: string,
    slackFn?: (message) => Promise<void>,
  ) {
    return this.openai.beta.threads.runs
      .stream(threadId, {
        assistant_id: 'asst_os1O6Teplk4ldDH3SsRKst0p',
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
        const runs = await this.openai.beta.threads.runs.list(threadId);

        for (const run of runs.data) {
          if (run.status !== 'completed') {
            await this.handleEvent(run, token, slackFn);
          }
        }
      });
  }

  public async runStream(
    threadId: string,
    token: string,
    slackFn?: (message) => Promise<void>,
  ): Promise<AssistantStream> {
    return await this.openai.beta.threads.runs
      .stream(threadId, {
        assistant_id: 'asst_os1O6Teplk4ldDH3SsRKst0p',
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

  public async runAssistant(
    threadId,
    token,
    slackFn?: (message) => Promise<void>,
  ): Promise<[Observable<any>, Subscriber<any>]> {
    try {
      return [
        new Observable((observer) => {
          this.observer = observer;

          this.openai.beta.threads.runs
            .stream(threadId, {
              assistant_id: 'asst_os1O6Teplk4ldDH3SsRKst0p',
            })
            .on('textCreated', this.handleTextCreated)
            .on('textDelta', this.handleTextDelta)
            .on('runStepCreated', this.handleRunStepCreated)
            .on('event', (event) => this.handleEvent(event, token, slackFn))
            .on('toolCallCreated', this.handleToolCallCreated)
            .on('toolCallDone', this.handleToolCallDone)
            .on('toolCallDelta', this.handleToolCallDelta)
            .on('error', async (error) => {
              console.log('Error running assistant', error);
              const runs = await this.openai.beta.threads.runs.list(threadId);

              for (const run of runs.data) {
                if (run.status !== 'completed') {
                  await this.handleEvent(run, token, slackFn);
                }
              }
            });
        }),
        this.observer,
      ];
    } catch (error) {
      console.error('Error running assistant', error);
    }
  }
}
