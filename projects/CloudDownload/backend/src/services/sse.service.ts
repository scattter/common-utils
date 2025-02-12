import { Injectable } from '@nestjs/common';
import { IMessageEvent } from '../interfaces/sse';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class SseService {
  private eventSubject = new Subject<IMessageEvent>();

  // 方法用于向所有订阅的客户端发送消息
  sendMessage(message: IMessageEvent) {
    this.eventSubject.next(message);
  }

  // 获取可观察对象，用于客户端订阅
  getMessages(): Observable<IMessageEvent> {
    return this.eventSubject.asObservable();
  }
}
