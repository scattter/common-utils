import { Controller, Get, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { SseService } from './services/sse.service';
import { IMessageEvent } from './interfaces/sse';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly sseService: SseService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @Sse('sse')
  // sse(): Observable<MessageEvent> {
  //   return interval(1000).pipe(
  //     map(() => ({ data: { hello: 'world' } }) as MessageEvent),
  //   );
  // }

  @Sse('sse')
  sse(): Observable<IMessageEvent> {
    return new Observable((observer) => {
      const subscription = this.sseService
        .getMessages()
        .subscribe((message) => {
          observer.next(message);
        });

      return () => {
        subscription.unsubscribe();
      };
    });
  }
}
