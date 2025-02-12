import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileModule } from './modules/file.module';
import { CommonModule } from './modules/common.module';

@Module({
  imports: [FileModule, CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
