// src/slack/slack.controller.ts
import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { SlackService } from './slack.service';

@Controller('slack')
export class SlackController {
  constructor(private readonly slackService: SlackService) {}

  @Post('commands')
  async handleCommand(@Body() body: any, @Res() response) {
    const result = await this.slackService.handleCommand(body.command);
    response.status(200).send({ text: result });
  }

  @Post('events')
  async handleEvent(@Req() req, @Res() response) {
    console.log(req.body);
    const { type, event } = req.body;

    if (type === 'url_verification') {
      // URL verification handshake
      response.status(200).send({ challenge: req.body.challenge });
    } else if (type === 'event_callback' && !event.bot_profile) {
      // Handle the event
      await this.slackService.handleEvent(event.type, event);
      response.status(200).send('Event received');
    }
  }
}
