import { Module } from '@nestjs/common';
import { FileController } from '../controllers/file.controller';
import { FileService } from '../services/file.service';

@Module({
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
