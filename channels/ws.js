require('dotenv').config();
const WebSocket = require('ws');
const NotificationChannel = require('@solstice.sebastian/notification-channel');
const Constants = require('../common/constants.js');

const { WS_USERNAME, WS_PASSWORD } = process.env;

class WsChannel extends NotificationChannel {
  constructor({ server }) {
    super();
    this.wsServer = new WebSocket.Server({
      verifyClient: this.verifyClient,
      server,
    });
    this.wsServer.on('connection', this.onConnection.bind(this));
    this.wsServer.on('error', this.onError.bind(this));
    this.wsServer.on('listening', this.onListening.bind(this));
  }

  send({ text, ticker, analytic }) {
    const tickerRecord = ticker.toRecord();
    const analyticRecord = analytic.toRecord();
    this.wsServer.clients.forEach((client) => {
      if (client.readyState === Constants.ws.readyStates.OPEN) {
        client.send(
          JSON.stringify({
            text,
            ticker: tickerRecord,
            analytic: analyticRecord,
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
