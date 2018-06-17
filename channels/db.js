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
    return db.insertOne({
      ...tickerRecord,
      ...moduleRecord,
    });
  }
}

module.exports = DbChannel;
