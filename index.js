/*
  eslint-disable no-unused-vars
*/
class NotificationChannel {
  /**
   * @param {String} text
   * @param {Object} data
   * @param {Object|Ticker} ticker
   */
  send({ text, data, ticker }) {
    throw new Error('Notification channel must implement #send');
  }
}

module.exports = NotificationChannel;
