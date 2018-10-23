import { NotificationChannel, SendArgs } from '../index';
import { getClient } from '@solstice.sebastian/db-client';
import { Collection, InsertOneWriteOpResult } from 'mongodb';

interface DbChannel {
  dbName: string;
  collectionName: string;
  mongoUrl: string;
}

interface Recordable {
  toRecord: () => any;
}

interface DbSendArgs extends SendArgs {
  data: Recordable;
  ticker: Recordable;
}

class DbChannel implements NotificationChannel {
  constructor({ dbName = 'notifications', collectionName = 'logs', mongoUrl }: DbChannel) {
    this.dbName = dbName;
    this.collectionName = collectionName;
    this.mongoUrl = mongoUrl;
  }

  /**
   * @return {Promise} Mongo.Db
   */
  private async getCollection(): Promise<Collection> {
    const client = await getClient(this.mongoUrl);
    const db = client.db(this.dbName);
    return db.collection(this.collectionName);
  }


  async send({ ticker, data }: DbSendArgs): Promise<InsertOneWriteOpResult> {
    const collection = await this.getCollection();
    const record = {
      ...data.toRecord(),
      ...ticker.toRecord(),
    };
    return collection.insertOne(record);
  }
}

module.exports = DbChannel;
