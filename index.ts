export type SendArgs = {
  text?: string;
  data?: any;
  ticker?: any;
}

export interface NotificationChannel {
  name: string;
  send({ text, data, ticker }: SendArgs): any | Promise<any>;
}

export { DbChannel } from './channels/db';
export { EmailChannel } from './channels/email';
export { LogChannel } from './channels/log';
export { MacChannel } from './channels/mac';
export { TextChannel } from './channels/text';
export { WsChannel } from './channels/ws';
