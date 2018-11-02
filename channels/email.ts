import { NotificationChannelType } from '@solstice.sebastian/constants';
import { NotificationChannel, SendArgs } from '../index';
const Emailer = require('@solstice.sebastian/emailer');

const u = process.env.EMAIL_USERNAME as string;
const p = process.env.EMAIL_PASSWORD as string;
const h = process.env.EMAIL_HOST as string;
const r = process.env.EMAIL_RECIPIENT as string;

interface EmailSendArgs extends SendArgs {
  text: string;
}

interface ChannelConfig {
  username?: string;
  password?: string;
  host?: string;
  recipient?: string;
}

class EmailChannel implements NotificationChannel {
  username: string;
  password: string;
  host: string;
  recipient: string;
  type = NotificationChannelType.EMAIL;

  constructor({ username = u, password = p, host = h, recipient = r }: ChannelConfig) {
    this.username = username;
    this.password = password;
    this.host = host;
    this.recipient = recipient;
  }

  async send({ text }: EmailSendArgs): Promise<any> {
    const subject = text.split('\n')[0];
    const emailer = Emailer({ username: this.username, password: this.password, host: this.host });
    emailer.setFrom('mi-oyente@gmail.com');
    emailer.setSubject(subject);
    emailer.setRecipient(this.recipient);
    return emailer.send({ text });
  }
}

export { EmailChannel };
