import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { sleep } from 'openai/core';
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
        AI Name: Morrigu AI, Inc.
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
        `,
      name: 'HR Helper',
      tools: tools as any,
      model: 'gpt-4-turbo',
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

  public async addMessageToThread(threadId: string, message: string) {
    try {
      const result = await this.openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: message,
      });

      return result;
    } catch (error) {
      console.error('Error adding message to thread', error);
      await this.runAssistant(threadId, '');
    }
  }

  // public async submitToolOutputs(event: AssistantStreamEvent) {
  //   return this.openai.beta.threads.runs;
  // }
  public handleTextCreated = async (text: any) => {
    this.observer.next({ event: 'textCreated', data: text });
    return text;
  };

  public handleTextDelta = async (textDelta: any, snapshot: any) => {
    this.observer.next({ event: 'textDelta', data: textDelta });
  };

  public handleRunStepCreated = async (runStep: any) => {
    this.observer.next({ event: 'runStepCreated', data: runStep });
  };

  public async get_call_results(calls: any, token) {
    return await Promise.all(
      calls.map(async (call) => {
        const q = new URLSearchParams(
          JSON.parse(call.function.arguments),
        ).toString();
        const callResp = await fetch(
          'http://localhost:6060/api/tools/' + call.function.name + '?' + q,
          {
            method: 'GET',
            headers: {
              Authorization: 'Bearer ' + token,
              'Content-Type': 'application/json',
            },
          },
        );

        const callRespJson = await callResp.json();
        console.log('callRespJson', callRespJson);
        return {
          tool_call_id: call.id,
          output: JSON.stringify(callRespJson, null, 1),
        };
      }),
    );
  }

  public handleEvent = async (event, token) => {
    this.observer.next({ event: 'event', data: event });
    if (event.data?.status === 'completed') {
    }
    if (event.data?.status === 'requires_action') {
      if (event.data?.required_action?.type === 'submit_tool_outputs') {
        const calls =
          event.data?.required_action?.submit_tool_outputs.tool_calls;

        const call_results = await this.get_call_results(calls, token);

        this.openai.beta.threads.runs
          .submitToolOutputsStream(event.data.thread_id, event.data.id, {
            tool_outputs: call_results,
          })
          .on('toolCallDone', this.handleToolCallDone)
          .on('toolCallDelta', this.handleToolCallDelta)
          .on('event', (event) => this.handleEvent(event, token))
          .on('toolCallCreated', this.handleToolCallCreated)
          .on('textCreated', this.handleTextCreated)
          .on('textDelta', this.handleTextDelta)
          .on('runStepCreated', this.handleRunStepCreated)
          .on('end', () => {
            this.observer.next({ event: 'streamEnded' });
            this.observer.complete();
          });
      }
    }
  };

  public getMessages = async (threadId: string) => {
    return this.openai.beta.threads.messages.list(threadId);
  };

  public handleToolCallCreated = async (toolCall: any) => {
    this.observer.next({ event: 'toolCallCreated', data: toolCall });
  };

  public handleToolCallDone = async (toolCall: any) => {
    this.observer.next({ event: 'toolCallDone', data: toolCall });
  };

  public handleToolCallDelta = async (toolCallDelta: any, snapshot: any) => {
    this.observer.next({ event: 'toolCallDelta', data: toolCallDelta });
  };

  public async runStream(threadId: string, token: string): Promise<void> {
    this.openai.beta.threads.runs
      .stream(threadId, {
        assistant_id: 'asst_os1O6Teplk4ldDH3SsRKst0p',
      })
      .on('textCreated', this.handleTextCreated)
      .on('textDelta', this.handleTextDelta)
      .on('runStepCreated', this.handleRunStepCreated)
      .on('event', (event) => this.handleEvent(event, token))
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
            .on('event', (event) => this.handleEvent(event, token))
            .on('toolCallCreated', this.handleToolCallCreated)
            .on('toolCallDone', this.handleToolCallDone)
            .on('toolCallDelta', this.handleToolCallDelta)
            .on('error', async (error) => {
              console.error('Error running assistant', error);
              const runs = await this.openai.beta.threads.runs.list(threadId);

              for (const run of runs.data) {
                if (run.status !== 'completed') {
                  await this.handleEvent(run, token);
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
