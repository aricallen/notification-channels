const NotificationChannel = require('../index.js');
const Logger = require('@solstice.sebastian/logger');

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
