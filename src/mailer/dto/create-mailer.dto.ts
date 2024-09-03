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
export class CreateMailerDto {
  from: {
    address: string;
    name: string;
  };
  to: string[];
  subject: string;
  text: string;
  category: string;
  sandbox?: boolean;
}
