export type SendArgs = {
  text?: string;
  data?: any;
  ticker?: any;
}

export interface NotificationChannel {
  send({ text, data, ticker }: SendArgs): any | Promise<any>;
}
