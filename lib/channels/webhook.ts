import { NotificationChannelType } from '@solstice.sebastian/constants';
import { NotificationChannel } from '../index';
import fetch, { RequestInit } from 'node-fetch';

export interface WebhookRequest {
  url: string;
  init: RequestInit;
}

class WebhookChannel implements NotificationChannel {
  type = NotificationChannelType.WEBHOOK;
  endpoints: string[] = [];
  requests: WebhookRequest[];

  constructor({ endpoints = [], requests = [] } = {}) {
    this.endpoints = endpoints;
    this.requests = requests;
  }

  addEndpoint(endpoint: string): void {
    this.endpoints.push(endpoint);
  }

  addRequest(request: WebhookRequest): void {
    this.requests.push(request);
  }

  async send(data: any): Promise<void> {
    const body = typeof data === 'string' ? data : JSON.stringify(data);
    for (const endpoint of this.endpoints) {
      try {
        const response = await fetch(endpoint, { body, method: 'POST' });
        console.log(
          `successful response to ${endpoint} with response: ${JSON.stringify(response)}`
        );
      } catch (err) {
        console.log(`error sending to ${endpoint} with error: ${JSON.stringify(err)}`);
        throw err;
      }
    }

    for (const request of this.requests) {
      try {
        const response = await fetch(request.url, request.init);
        console.log(
          `successful response to ${request.url} with response: ${JSON.stringify(response)}`
        );
      } catch (err) {
        console.log(`error sending to ${request.url} with error: ${JSON.stringify(err)}`);
        throw err;
      }
    }
  }
}

export { WebhookChannel };
