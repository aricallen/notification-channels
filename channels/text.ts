import { NotificationChannel, SendArgs } from '../index';
const twilio = require('twilio');

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TEXT_RECIPIENT, TWILIO_NUMBER } = process.env;

interface TextSendArgs extends SendArgs {
  text: string;
}

class TextChannel implements NotificationChannel {
  client: any;
  name = 'text';

  constructor() {
    this.client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  }

  /**
   * @param {String} text
   * @return {Promise}
   */
  send({ text }: TextSendArgs): any {
    return this.client.messages.create({
      body: text,
      from: TWILIO_NUMBER,
      to: TEXT_RECIPIENT,
    });
  }
}

export { TextChannel };
