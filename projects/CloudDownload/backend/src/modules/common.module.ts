import { Global, Module } from '@nestjs/common';
import { PlaywrightService } from '../services/playwright.service';
import { SseService } from '../services/sse.service';
import { LoggerService } from '../services/logger.service';

@Global()
@Module({
  providers: [PlaywrightService, SseService, LoggerService],
  exports: [PlaywrightService, SseService, LoggerService],
})
export class CommonModule {}
