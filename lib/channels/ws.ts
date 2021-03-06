import { ReadyState, NotificationChannelType, BotAction } from '@solstice.sebastian/constants';
import WebSocket, { AddressInfo } from 'ws';
import { NotificationChannel, SendArgs } from '../index';
import http from 'http';
import { msToDatetime } from '@solstice.sebastian/helpers';

const { WS_USERNAME, WS_PASSWORD } = process.env;

interface info {
  origin: string;
  req: http.IncomingMessage;
}

interface Recordable {
  toRecord: () => any;
}

class WsChannel implements NotificationChannel {
  wsServer: WebSocket.Server;
  type = NotificationChannelType.WEB_SOCKET;

  constructor({ server, onConnection }: { server: any, onConnection: (channel: WsChannel) => void }) {
    this.wsServer = new WebSocket.Server({
      verifyClient: this.verifyClient,
      server,
    });
    this.wsServer.on('connection', onConnection ? () => onConnection.bind(this) : this.onConnection.bind(this));
    this.wsServer.on('error', this.onError.bind(this));
    this.wsServer.on('listening', this.onListening.bind(this));
  }

  getServer() {
    return this.wsServer;
  }

  send(data: any): void {
    this.wsServer.clients.forEach((client) => {
      if (client.readyState === ReadyState.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  onConnection() {
    // console.log(`socket:`, socket);
    // console.log(`req:`, req);
    console.log(`new connection @ ${msToDatetime(Date.now())}`);
    console.log(`total clients = ${this.wsServer.clients.size}`);
  }

  onError(event: any): void {
    console.log(`error:`, event.name);
    console.log(`stack:`, event.stack);
    throw event.error;
  }

  onListening() {
    const addressInfo: AddressInfo = this.wsServer.address() as AddressInfo;
    console.log(`wsServer listening at '${addressInfo.address}' on port '${addressInfo.port}' with family '${addressInfo.family}'`);
  }

  /**
   * @param {String} origin
   * @param {Request} req
   * @param {Boolean} secure
   */
  verifyClient({ origin, req }: info) {
    let clientUrl;
    if (origin === undefined) {
      clientUrl = req.headers.host;
    } else {
      clientUrl = origin;
    }

    const { username, password } = JSON.parse(req.headers.authorization!);

    if (username === WS_USERNAME && password === WS_PASSWORD) {
      console.log(`'${clientUrl}' authenticated successfully @ ${msToDatetime(Date.now())}`);
      return true;
    }
    return false;
  }
}

export { WsChannel };
