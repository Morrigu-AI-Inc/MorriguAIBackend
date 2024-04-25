// src/slack/slack.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WebClient } from '@slack/web-api';
import { Model } from 'mongoose';
import { ExternalSlackMappingDocument } from 'src/db/schemas/ExternalSlackMapping';
import { OpenaiService } from 'src/openai/openai.service';


@Injectable()
export class SlackService {
  private readonly slackClient: WebClient;

  constructor(
    private readonly openaiService: OpenaiService,
    @InjectModel('ExternalSlackMapping')
    private readonly externalSlackMappingModel: Model<ExternalSlackMappingDocument>,
  ) {
    this.slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);
  }

  async handleCommand(command: string): Promise<string> {
    // Handle different commands based on the input
    switch (command) {
      case '/echo':
        return 'Echo!';
      default:
        return 'Unknown command';
    }
  }

  async handleEvent(eventType: string, eventBody: any): Promise<void> {
    if (eventBody.type === 'message') {
      const found = await this.externalSlackMappingModel.findOne({
        slackUserId: eventBody.user,
        channelId: `${eventBody.channel_type}:${eventBody.channel}`,
      });

      if (!found) {
        const thread = await this.openaiService.getNewThread();
        this.externalSlackMappingModel.create({
          slackUserId: eventBody.user,
          channelId: `${eventBody.channel_type}:${eventBody.channel}`,
          threadId: thread.id,
          channel: eventBody,
        });

        await this.openaiService.addMessageToThread(thread.id, eventBody.text);

        // const run = this.openaiService.runStreamSlack(
        //   found.threadId,
        //   token,
        //   (text) => this.sendMessage(eventBody.channel, text.value),
        // );
      } else {
        console.log('FOUND', found.threadId, eventBody.text);
        // await this.openaiService.addMessageToThread(
        //   found.threadId,
        //   eventBody.text,
        //   (text) => this.sendMessage(eventBody.channel, text.value),
        // );

        console.log('RUNNING STREAM');

        // const run = this.openaiService.runStreamSlack(
        //   found.threadId,
        //   token,
        //   (text) => this.sendMessage(eventBody.channel, text),
        // );
      }
    }
  }

  async sendMessage(channelId: string, message: string): Promise<void> {
    console.log('SENDING MESSAGES', channelId, message);
    await this.slackClient.chat.postMessage({
      channel: channelId,
      text: message,
    });
  }
}
