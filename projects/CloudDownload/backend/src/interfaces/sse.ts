import { SSE_EVENT } from '../enums/sse';

export interface IMessageEvent {
  data: string | object;
  type: SSE_EVENT;
  id?: string;
  retry?: number;
}
