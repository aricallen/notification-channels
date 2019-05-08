import { NotificationChannelType as NcType } from '@solstice.sebastian/constants';

export type SendArgs = {
  text?: string;
  data?: any;
  ticker?: any;
}

export interface NotificationChannel {
  type: string;
  send({ text, data, ticker }: SendArgs): any | Promise<any>;
}

import { DbChannel } from './channels/db';
import { EmailChannel } from './channels/email';
import { LogChannel } from './channels/log';
import { MacChannel } from './channels/mac';
import { TextChannel } from './channels/text';
import { WsChannel } from './channels/ws';
import { WebhookChannel } from './channels/webhook';

export interface NcCtor {
  new (...args: any[]): NotificationChannel;
}

const NcTuples: [NcType, NcCtor][] = [
  [NcType.DATABASE, DbChannel],
  [NcType.EMAIL, EmailChannel],
  [NcType.LOG, LogChannel],
  [NcType.MAC, MacChannel],
  [NcType.TEXT, TextChannel],
  [NcType.WEB_SOCKET, WsChannel],
  [NcType.WEBHOOK, WebhookChannel],
];

export const NotificationChannelCtorMap = new Map<NcType, NcCtor>(NcTuples);

export { DbChannel } from './channels/db';
export { EmailChannel } from './channels/email';
export { LogChannel } from './channels/log';
export { MacChannel } from './channels/mac';
export { TextChannel } from './channels/text';
export { WsChannel } from './channels/ws';
export { WebhookChannel } from './channels/webhook';