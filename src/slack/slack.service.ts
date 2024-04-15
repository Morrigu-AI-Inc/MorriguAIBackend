// src/slack/slack.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WebClient } from '@slack/web-api';
import { Model } from 'mongoose';
import { ExternalSlackMappingDocument } from 'src/db/schemas/ExternalSlackMapping';
import { OpenaiService } from 'src/openai/openai.service';

const token =
  'Bearer yJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoib2F1dGgiLCJuYW1lIjoiSmFzb24gU3QuIEN5ciIsImVtYWlsIjoiamFzb25AbW9ycmlndS5haSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKM01yOEhINGFJNURfSE1Oak9LWTd4UmV2OWV3NHNtbU5GbnNET0NhMDRodFk5aGc9czk2LWMiLCJwcm92aWRlckFjY291bnRJZCI6Imdvb2dsZS1vYXV0aDJ8MTE4MzgyNDc2ODAyNjY5NTQ5ODU4IiwicHJvdmlkZXIiOiJhdXRoMCIsImdpdmVuX25hbWUiOiJKYXNvbiIsImZhbWlseV9uYW1lIjoiU3QuIEN5ciIsImxvY2FsZSI6ImVuIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuaWNrbmFtZSI6Imphc29uIiwidXBkYXRlZEF0IjoiMjAyNC0wNC0wOFQwMzo1Njo1Mi4wMDlaIiwiaW1hZ2UiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKM01yOEhINGFJNURfSE1Oak9LWTd4UmV2OWV3NHNtbU5GbnNET0NhMDRodFk5aGc9czk2LWMiLCJ1c2VyX2lkIjoiZ29vZ2xlLW9hdXRoMnwxMTgzODI0NzY4MDI2Njk1NDk4NTgiLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExODM4MjQ3NjgwMjY2OTU0OTg1OCIsImV4cCI6MTcxMzEzOTU5MSwiaWF0IjoxNzEzMTM1OTYxfQ.qAd49jGSimI9MtDN3PcDZAYlxn8D0y8zXLpD279Qa5P_Ff1P_NbD4Vxj8Xug3_r3FvFOF81pSBKkjGwABCUkPzg3GoY5pZNzR7hd2y4Qtfp2YzoFB01fyZBhzMndc4qWxQcJmHGkvlzWQiHSfAK4gHzIhurq3RvTunwmdxZnxpiZ_SjIKDx1YNGMANVA_5NCmTcNPzhJAMzrC9iLbwJj5Sb5rG2wb97UTKPFcSzqqxnqqOdTSaUlvCGU5nF2c3NbNpgt6wW1hMRnDzoF2ZqgB5GPDF_Tt6AIrorpHUWgFhjZ7RAYFZXH_FOvNzxpDrjpHgSxQookuR4elLMq9YInW4E8uST4FLOM8sqnccDC5ZCFFsna2kZNOaEmalrAwKqtoKksPHmpQanHbCTVfWCUJjSfxJE5h4VxXOBii4-mr1s9B_I5i_RnXHg-_tZKNN5gu-rjsqCfBWukqtLzwZvz3J4zwtcY82Cqz8hvfuZKaj08FYuGGaXKelRyaFGJS4aH43TBRr6AgKR9gj169MAZSHnCr4xoUKRWQzHTEKO-j2ukBWscYJA11mWxcl4cEG0O6LmcLjz6c2hGcKa-uvSAqrsxCK8krM8gHst7leFS0k3HSPvtpars3EfJVK-d3qE57flXiEHKY-Qb2A7ft8mQ9BeI2xDiQxF1tqYytr-H1JQ';

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

        const run = this.openaiService.runStreamSlack(
          found.threadId,
          token,
          (text) => this.sendMessage(eventBody.channel, text.value),
        );
      } else {
        console.log('FOUND', found.threadId, eventBody.text);
        await this.openaiService.addMessageToThread(
          found.threadId,
          eventBody.text,
          (text) => this.sendMessage(eventBody.channel, text.value),
        );

        console.log('RUNNING STREAM');

        const run = this.openaiService.runStreamSlack(
          found.threadId,
          token,
          (text) => this.sendMessage(eventBody.channel, text),
        );
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
