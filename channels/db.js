require('dotenv').config();
const NotificationChannel = require('@solstice.sebastian/notification-channel');
const { getClient } = require('../modules/db-client.js');

const { DB_NAME, NOTIFICATION_DB_NAME } = process.env;

class DbChannel extends NotificationChannel {
  constructor() {
    super();
    this.dbName = DB_NAME;
    this.collectionName = NOTIFICATION_DB_NAME || 'notification_logs';
  }

  async getDb() {
    const client = await getClient();
    const db = client.db(this.dbName);
    return db.collection(this.collectionName);
  }

  async send({ ticker, analytic }) {
    const db = await this.getDb();
    const tickerRecord = ticker.toRecord();
    const analyticRecord = await analytic.toRecord();
    return db.insertOne({
      ...tickerRecord,
      ...analyticRecord,
    });
  }
}

module.exports = DbChannel;
