require('dotenv').config();
const { getClient } = require('@solstice.sebastian/db-client');
const NotificationChannel = require('../index.js');

const { DB_NAME, COLLECTION_NAME } = process.env;

class DbChannel extends NotificationChannel {
  constructor({ dbName = DB_NAME, collectionName = COLLECTION_NAME } = {}) {
    super({ dbName, collectionName });
    this.dbName = dbName;
    this.collectionName = collectionName || 'notification_logs';
  }

  /**
   * @return {Promise} Mongo.Db
   */
  async getDb() {
    const client = await getClient();
    const db = client.db(this.dbName);
    return db.collection(this.collectionName);
  }

  /**
   * @param {Ticker} ticker
   * @param {String} text
   * @param {Any} module
   * @return {Promise<MongoClient>}
   */
  async send({ ticker, module }) {
    const db = await this.getDb();
    let tickerRecord = ticker;
    if (typeof ticker.toRecord === 'function') {
      tickerRecord = ticker.toRecord();
    }
    let moduleRecord = module;
    if (typeof module.toRecord === 'function') {
      moduleRecord = module.toRecord();
    }
    const record = {
      ...moduleRecord,
      ...tickerRecord,
    };
    return db.insertOne(record);
  }
}

module.exports = DbChannel;
