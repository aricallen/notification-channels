const NotificationChannel = require('@solstice.sebastian/notification-channel');
const Logger = require('../modules/logger.js');

class LogChannel extends NotificationChannel {
  constructor({ path = 'notifications.log' } = {}) {
    super();
    this.path = path;
    this.logger = Logger({ path });
  }

  async send({ text }) {
    this.logger.toFile({ text });
    this.logger.toConsole({ text });
    return Promise.resolve();
  }
}

module.exports = LogChannel;
