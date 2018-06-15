require('dotenv').config();
const { getClient } = require('@solstice.sebastian/db-client');
const NotificationChannel = require('../index.js');

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
