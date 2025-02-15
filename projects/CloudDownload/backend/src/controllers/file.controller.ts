import { Body, Controller, Get, Post } from '@nestjs/common';
import { FileService } from '../services/file.service';
import {
  DownloadParamDto,
  FileParamDto,
  FolderParamDto,
  ValidParamDto,
} from '../dto/file.dto';
import { IFileInfo } from '../interfaces/file';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('/parse')
  queryAllFiles(@Body() queryFileDto: FileParamDto): Promise<IFileInfo[]> {
    return this.fileService.queryAllFiles(queryFileDto);
  }

  @Post('/folder')
  queryAllFolderInfo(@Body() folderParamDto: FolderParamDto) {
    return this.fileService.queryAllFolder(folderParamDto);
  }

  @Post('/createFolder')
  createFolder(@Body() folderParamDto: FolderParamDto) {
    return this.fileService.createFolder(folderParamDto.baseUrl);
  }

  @Post('/download')
  downloadFile(@Body() downloadParamDto: DownloadParamDto) {
    return this.fileService.download(
      downloadParamDto.files,
      downloadParamDto.baseUrl,
    );
  }

  @Post('/updateValid')
  validInfoUpdate(@Body() validParamDto: ValidParamDto) {
    return this.fileService.validInfoUpdate(validParamDto);
  }

  @Get('/abort')
  abortAction() {
    return this.fileService.abortAction();
  }

  @Post('/test')
  test() {
    return this.fileService.test();
  }
}
