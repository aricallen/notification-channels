require('dotenv').config();
const NotificationChannel = require('../index.js');
const Emailer = require('@solstice.sebastian/emailer');

const u = process.env.EMAIL_USERNAME;
const p = process.env.EMAIL_PASSWORD;
const h = process.env.EMAIL_HOST;
const r = process.env.EMAIL_RECIPIENT;

class Email extends NotificationChannel {
  constructor({ username = u, password = p, host = h, recipient = r } = {}) {
    super();
    this.username = username;
    this.password = password;
    this.host = host;
    this.recipient = recipient;
  }

  send({ text }) {
    const subject = text.split('\n')[0];
    const emailer = Emailer({ username: this.username, password: this.password, host: this.host });
    emailer.setFrom('mi-oyente@gmail.com');
    emailer.setSubject(subject);
    emailer.setRecipient(this.recipient);
    return emailer.send({ text });
  }
}

module.exports = Email;
