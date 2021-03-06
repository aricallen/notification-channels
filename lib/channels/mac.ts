import { NotificationChannelType } from '@solstice.sebastian/constants';
import { NotificationChannel, SendArgs } from '../index';
const { NotificationCenter } = require('node-notifier');

interface MacSendArgs extends SendArgs {
  text: string;
}

class MacChannel implements NotificationChannel {
  notifier: any;
  type = NotificationChannelType.MAC;

  constructor() {
    this.notifier = new NotificationCenter();
  }

  send({ text }: MacSendArgs): Promise<any> {
    const textParts = text.split('\n');
    return new Promise((res, rej) => {
      this.notifier.notify(
        {
          title: `MiOyente`,
          subtitle: textParts[0],
          message: text,
          sound: 'Ping',
          wait: true,
          timeout: 15,
        },
        (err: Error, response: any) => {
          if (err) {
            return rej(err);
          }
          return res(response);
        }
      );
    });
  }
}

export { MacChannel };
