import { NotificationChannelType } from '@solstice.sebastian/constants';
import { NotificationChannel, SendArgs } from '../index';
const Logger = require('@solstice.sebastian/logger');

interface ChannelConfig {
  path?: string;
  logger: any;
}

interface LogSendArgs extends SendArgs {
  text: string;
}

class LogChannel implements NotificationChannel {
  path: string;
  logger: any;
  type = NotificationChannelType.LOG;

  constructor({ path = 'notifications.log' }: ChannelConfig) {
    this.path = path;
    this.logger = Logger({ path });
  }

  async send({ text }: LogSendArgs): Promise<void> {
    this.logger.toFile({ text });
    this.logger.toConsole({ text });
    return Promise.resolve();
  }
}

export { LogChannel };
