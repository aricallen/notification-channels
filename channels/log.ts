import { NotificationChannel, SendArgs } from '../index';
const Logger = require('@solstice.sebastian/logger');

interface LogChannel {
  path?: string;
  logger: any;
}

interface LogSendArgs extends SendArgs {
  text: string;
}

class LogChannel implements NotificationChannel {
  constructor({ path = 'notifications.log' }: LogChannel) {
    this.path = path;
    this.logger = Logger({ path });
  }

  async send({ text }: LogSendArgs): Promise<void> {
    this.logger.toFile({ text });
    this.logger.toConsole({ text });
    return Promise.resolve();
  }
}

module.exports = LogChannel;
