import { Inject, Injectable, Logger } from '@nestjs/common';
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
import { createFolder } from 'src/utils/addFolder';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class FileService {
  constructor(
    private readonly playwrightService: PlaywrightService,
    private readonly sseService: SseService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
  ) {
    // 在这里可以使用databaseService的方法，如查询用户数据
  }

  async queryAllFiles(fileParam: IFileParam): Promise<IFileInfo[]> {
    this.logger.log('start queryAllFiles', fileParam);
    try {
      await this.playwrightService.init(
        fileParam.downloadUrl,
        fileParam.sharePwd,
      );
      this.logger.log('playwrightService init end');
      this.sseService.sendMessage({
        type: SSE_EVENT.START_PARSE,
        data: { message: '开始解析' },
      });
      return await this.playwrightService.queryAllFiles();
    } catch (e) {
      this.logger.error(e, FileService.name);
      return [];
    }
  }

  async queryAllFolder(folderParam: IFolderParam): Promise<IFolderInfo> {
    this.logger.log('start queryAllFolder', FileService.name);
    return queryFolderInfo(folderParam.baseUrl);
  }

  /**
   * 新建文件夹
   * @param dirPath 文件夹路径
   * @returns 返回创建结果（成功或失败）
   */
  createFolder(dirPath: string) {
    return createFolder(dirPath);
  }

  async download(downloadParam: IFileInfo[], baseUrl: string) {
    this.playwrightService
      .checkLogin()
      .then(() => this.playwrightService.downloadFile(downloadParam, baseUrl));
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
