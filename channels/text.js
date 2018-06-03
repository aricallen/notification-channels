require('dotenv').config();
const twilio = require('twilio');
const NotificationChannel = require('@solstice.sebastian/notification-channel');

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TEXT_RECIPIENT, TWILIO_NUMBER } = process.env;

class Text extends NotificationChannel {
  constructor() {
    super();
    this.client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  }

  /**
   * @param {String} text
   * @return {Promise}
   */
  send({ text }) {
    return this.client.messages.create({
      body: text,
      from: TWILIO_NUMBER,
      to: TEXT_RECIPIENT,
    });
  }
}

module.exports = Text;
