const { NotificationCenter } = require('node-notifier');
const NotificationChannel = require('@solstice.sebastian/notification-channel');

class MacChannel extends NotificationChannel {
  constructor() {
    super();
    this.notifier = new NotificationCenter();
  }

  send({ text }) {
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
        (err, response) => {
          if (err) {
            return rej(err);
          }
          return res(response);
        }
      );
    });
  }
}

module.exports = MacChannel;
