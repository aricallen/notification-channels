require('dotenv').config();
const Constants = require('@solstice.sebastian/constants');
const WebSocket = require('ws');
const NotificationChannel = require('../index.js');

const { WS_USERNAME, WS_PASSWORD } = process.env;

class WsChannel extends NotificationChannel {
  constructor({ server, username = WS_USERNAME, password = WS_PASSWORD }) {
    super();
    this.wsServer = new WebSocket.Server({
      verifyClient: this.verifyClient,
      server,
    });
    this.wsServer.on('connection', this.onConnection.bind(this));
    this.wsServer.on('error', this.onError.bind(this));
    this.wsServer.on('listening', this.onListening.bind(this));
  }

  getServer() {
    return this.wsServer;
  }

  /**
   * @param {String} text
   * @param {Ticker} ticker
   * @param {Any} module
   */
  send({ text, ticker, module }) {
    const tickerRecord = ticker.toRecord();
    let moduleRecord = module;
    if (typeof module.toRecord === 'function') {
      moduleRecord = module.toRecord();
    }
    this.wsServer.clients.forEach((client) => {
      if (client.readyState === Constants.ws.readyStates.OPEN) {
        client.send(
          JSON.stringify({
            text,
            ticker: tickerRecord,
            module: moduleRecord,
          })
        );
      }
    });
  }

  /**
   * @param {Socket} socket
   * @param {Request} request
   */
  onConnection() {
    // console.log(`socket:`, socket);
    // console.log(`req:`, req);
    console.log('new connection');
  }

  onError({ error }) {
    console.log(`error:`, error.name);
    console.log(`stack:`, error.stack);
    throw error;
  }

  onListening() {
    const { address, family, port } = this.wsServer.address();
    console.log(`wsServer listening at '${address}' on port '${port}' with family '${family}'`);
  }

  /**
   * @param {String} origin
   * @param {Request} req
   * @param {Boolean} secure
   */
  verifyClient({ origin, req }) {
    let clientUrl;
    if (origin === undefined) {
      clientUrl = req.headers.host;
    } else {
      clientUrl = origin;
    }

    const { username, password } = JSON.parse(req.headers.authorization);

    if (username === WS_USERNAME && password === WS_PASSWORD) {
      console.log(`'${clientUrl}' authenticated successfully`);
      return true;
    }
    return false;
  }
}

module.exports = WsChannel;
