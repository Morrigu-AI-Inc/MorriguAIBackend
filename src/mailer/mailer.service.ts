import { Injectable } from '@nestjs/common';
import { CreateMailerDto } from './dto/create-mailer.dto';
import { UpdateMailerDto } from './dto/update-mailer.dto';
import * as Nodemailer from 'nodemailer';
import { MailtrapTransport } from 'mailtrap';

// const sender = {
//   address: "mailtrap@example.com",
//   name: "Mailtrap Test",
// };
// const recipients = [
//   "jason@morrigu.ai",
// ];

// transport
//   .sendMail({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//     sandbox: true
//   })
//   .then(console.log, console.error);

@Injectable()
export class MailerService {
  private transport: any;

  constructor() {
    const transport = Nodemailer.createTransport(
      MailtrapTransport({
        token: '278e6400a2b4aaf4b85e23e6ff47aad7',
      }),
    );

    this.transport = transport;
  }

  sendMail(createMailerDto: CreateMailerDto) {
    return this.transport.sendMail(createMailerDto);
  }
}
