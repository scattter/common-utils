import { Injectable } from '@nestjs/common';
import {
  IFileInfo,
  IFileParam,
  IFolderInfo,
  IFolderParam,
  IValidInfo,
} from '../interfaces/file';
import { PlaywrightService } from './playwright.service';
import { SseService } from './sse.service';
import { SSE_EVENT } from '../enums/sse';
import { queryFolderInfo } from '../utils/queryFolder';
import { LoggerService } from './logger.service';

@Injectable()
export class FileService {
  constructor(
    private readonly playwrightService: PlaywrightService,
    private readonly sseService: SseService,
    private readonly logger: LoggerService,
  ) {
    // 在这里可以使用databaseService的方法，如查询用户数据
  }

  async queryAllFiles(fileParam: IFileParam): Promise<IFileInfo[]> {
    try {
      await this.playwrightService.init(
        fileParam.downloadUrl,
        fileParam.sharePwd,
      );
      this.sseService.sendMessage({
        type: SSE_EVENT.START_PARSE,
        data: { message: '开始解析' },
      });
      return await this.playwrightService.queryAllFiles();
    } catch (e) {
      this.logger.error(e);
      return [];
    }
  }

  async queryAllFolder(folderParam: IFolderParam): Promise<IFolderInfo> {
    return queryFolderInfo(folderParam.baseUrl);
  }

  async download(downloadParam: IFileInfo[]) {
    this.playwrightService
      .checkLogin()
      .then(() => this.playwrightService.downloadFile(downloadParam));
    return {};
  }

  validInfoUpdate(validInfo: IValidInfo) {
    this.playwrightService.update(validInfo.type, validInfo.val);
    return {};
  }

  abortAction() {
    this.playwrightService.abortAction();
    return {};
  }

  test() {
    this.playwrightService.test();
    return {};
  }
}
