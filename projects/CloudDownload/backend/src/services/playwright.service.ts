import { Inject, Injectable, Logger } from '@nestjs/common';
import { IFileInfo } from '../interfaces/file';
import { chromium, devices, Locator, Page } from 'playwright';
import { FILE_CATEGORY, VALID_INFO_TYPE } from '../enums/file';
import {
  MAX_CODE_RETRY_COUNT,
  PS_PAGE_EVENT_WAIT_TIME,
  PS_PAGE_WAIT_TIME,
  PS_RESPONSE_WAIT_TIME,
} from '../consts';
import { SseService } from './sse.service';
import { SSE_EVENT } from '../enums/sse';
import { sseEventMap } from '../utils/chineseMap';
import { AxiosProgressEvent } from 'axios';
import { handleDownload } from '../utils/sseFileDown';
import * as fs from 'fs';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class PlaywrightService {
  private curPage: Page | undefined;
  // 分享的id (如果走模拟下载就不用这个参数)
  // private shareId: number | undefined;
  // 链接地址
  private downloadUrl: string;
  // 手机号
  private phone: string = '';
  // 分享链接打开的密码
  private sharePwd: string | undefined;
  // 短信验证码
  private smsCode: string = '';
  // 短信验证码的检查次数
  private attrCheckCount: number = 0;
  // 是否中断
  private abort: boolean = false;

  constructor(
    private readonly sseService: SseService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async init(downloadUrl: string, sharePwd?: string) {
    this.downloadUrl = downloadUrl;
    this.sharePwd = sharePwd;
    this.logger.log('playwright start init', PlaywrightService.name);
    if (this.curPage) {
      await this.curPage.goto(this.downloadUrl, {
        waitUntil: 'domcontentloaded',
      });
      if (this.sharePwd) {
        await this.handleSharePwd();
      }
    } else {
      try {
        // Setup
        const browser = await chromium.launch({
          headless: true,
        });
        this.logger.log('browser launch', PlaywrightService.name);
        const s9 = devices['Galaxy S9+'];
        const context = await browser.newContext({
          ...s9,
        });
        const page = await context.newPage();
        this.logger.log('page created', PlaywrightService.name);
        let cookies = [];
        try {
          cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8')) ?? {};
        } catch (err) {
          this.logger.error(err, PlaywrightService.name);
        }
        await page.context().addCookies(cookies);
        await page.goto(this.downloadUrl, { waitUntil: 'domcontentloaded' });
        this.logger.log('goto target page', PlaywrightService.name);
        this.curPage = page;
        if (this.sharePwd) {
          await this.handleSharePwd();
        }
      } catch (e) {
        this.logger.error(e, PlaywrightService.name);
      }
    }
  }

  async handleSharePwd() {
    if (!this.sharePwd || !this.curPage) return;
    await this.curPage.waitForTimeout(PS_PAGE_WAIT_TIME);
    const accessCode = this.curPage.locator('.access-code-input');
    // 如果之前输入过分享码, 后续再进入就不用输入了
    const locators = await accessCode.all();
    if (locators.length === 0) return;
    const accessBtn = this.curPage.locator('.button');
    await accessCode.fill(this.sharePwd);
    await accessBtn.click();
    await this.curPage.waitForLoadState('domcontentloaded');
  }

  async queryAllFiles() {
    const result: IFileInfo[] = [];
    this.logger.log('start query all files', PlaywrightService.name);
    await this.findAllFile(this.curPage, result, true);
    return result;
  }

  async findAllFile(page: Page, data: IFileInfo[], isRoot?: boolean) {
    this.logger.log('start find all file', PlaywrightService.name);
    const response = await page.waitForResponse(/listShareDir/, {
      timeout: PS_RESPONSE_WAIT_TIME,
    });
    const res = await response.json();
    await page.waitForTimeout(PS_PAGE_WAIT_TIME);
    if (res.res_code !== 0) {
      return;
    }
    const { folderList, fileList } = res.fileListAO;
    const fileInfosLocator = page.locator('.file-right');
    const allLocator = await fileInfosLocator.all();
    for await (const locator of allLocator) {
      const titleLocator = locator.locator('.name');
      const title = await titleLocator.innerText();
      const target = folderList
        .concat(fileList)
        .find((item: any) => item.name === title);
      if (!target.mediaType) {
        const temp: IFileInfo = {
          category: FILE_CATEGORY.FOLDER,
          name: title,
          id: target.id,
          children: [],
          checked: false,
        };
        data.push(temp);
        // 进入遍历里面的文件夹
        await locator.click();
        await this.findAllFile(page, temp.children, false);
      } else {
        data.push({
          category: FILE_CATEGORY.FILE,
          name: title,
          id: target.id,
          children: [],
          checked: !!isRoot,
        });
      }
    }
    if (!isRoot) await page.goBack();
  }

  async downloadClick(locator: Locator) {
    // 选中文件
    const fileBtn = locator.locator('.file-right-icon-wrap');
    await fileBtn.click();
    await this.curPage.waitForTimeout(PS_PAGE_WAIT_TIME);
    // 触发下载
    const downloadBtns = await this.curPage.locator('.operate-item').all();
    if (downloadBtns.length < 3) return;
    const downloadBtn = downloadBtns[1];
    await downloadBtn.click();
  }

  async downloadFile(
    data: IFileInfo[],
    baseUrl: string,
    isRoot: boolean = true,
  ) {
    if (!this.curPage) return;
    const fileInfosLocator = this.curPage.locator('.file-right');
    const allLocator = await fileInfosLocator.all();
    for await (const locator of allLocator) {
      const title = await locator.locator('.file-info .name').innerText();
      const item = data.find((v) => v.name === title);
      if (!item) {
        continue;
      }
      if (item.category === FILE_CATEGORY.FOLDER) {
        // 进入文件夹内部
        await locator.click();
        await this.curPage.waitForTimeout(PS_PAGE_WAIT_TIME);
        await this.downloadFile(item.children, baseUrl, false);
      } else if (item.checked) {
        // 文件后面选中组件
        const fileBtn = locator.locator('.file-right-icon-wrap');
        // 触发下载事件
        await this.downloadClick(locator);
        // 监听下载事件
        const downloadPromise = this.curPage.waitForEvent('download', {
          timeout: PS_PAGE_EVENT_WAIT_TIME,
        });
        // 等待接口返回, 查看下载链接
        const response = await this.curPage.waitForResponse(
          /getFileDownloadUrl/,
          { timeout: PS_RESPONSE_WAIT_TIME },
        );
        const res = await response.json();
        // 取消浏览器的下载行为
        const download = await downloadPromise;
        await download.cancel();
        // 取消选中
        await fileBtn.click();
        if (res.res_code === 0) {
          const fileDownloadUrl = res.fileDownloadUrl;
          // 开始下载
          this.sseService.sendMessage({
            type: SSE_EVENT.PHASE_START_DOWN,
            data: {
              message: `开始下载: ${title}`,
              title,
            },
          });
          try {
            await handleDownload(fileDownloadUrl, baseUrl, (event) =>
              this.showDownloadInfo(event, this.sseService, title),
            );
          } catch {
            this.sseService.sendMessage({
              type: SSE_EVENT.PHASE_ERROR,
              data: {
                message: `下载失败`,
                title,
              },
            });
          }
        }
      }
    }
    // 返回上一层级
    if (!isRoot) await this.curPage.goBack();
  }

  async checkLogin() {
    this.logger.log('check login', PlaywrightService.name);
    try {
      if (!this.curPage) return;
      // 通过点击下载按钮来判断是否登录
      const fileInfosLocator = this.curPage.locator('.file-right');
      const allLocator = await fileInfosLocator.all();
      const locator = allLocator[0];
      // 触发下载事件
      await this.downloadClick(locator);
      const popEle = this.curPage.locator('.error-pop');
      const popEleLocators = await popEle.all();
      if (popEleLocators.length > 0) {
        const phoneLogin = this.curPage.locator('.ok-btn');
        await phoneLogin.click();

        const phoneInput = this.curPage.locator('#j-sms-userName');
        const codeInput = this.curPage.locator('#j-sms-password');
        const loginSubmit = this.curPage.locator('#j-sms-submit');
        const codeTrigger = this.curPage.locator('#j-sms-send');
        const checked = this.curPage.locator('#j-agreement-checkbox-sms');

        const phone = await this.checkAttr(
          VALID_INFO_TYPE.PHONE,
          SSE_EVENT.NEED_PHONE,
        );
        if (!phone) return;
        await checked.click();
        await phoneInput.fill(phone);
        await this.curPage.waitForTimeout(PS_PAGE_WAIT_TIME);
        await codeTrigger.click();

        const smsCode = await this.checkAttr(
          VALID_INFO_TYPE.SMS_CODE,
          SSE_EVENT.NEED_SMS_CODE,
        );
        if (!smsCode) return;
        await codeInput.fill(smsCode.toString());
        await loginSubmit.click();
        await this.curPage.waitForTimeout(PS_RESPONSE_WAIT_TIME);
        // 获取Cookie
        const cookies = await this.curPage.context().cookies();
        // 将Cookie(不保存分享码)保存到本地文件，这里命名为'cookies.json'
        fs.writeFileSync(
          'cookies.json',
          JSON.stringify(
            cookies.filter((cookie) => !cookie.name.includes('shareId')),
          ),
        );
      } else {
        // 如果是已经登录了, 这时候要取消下载, 重新加载页面即可
        await this.curPage.reload({ waitUntil: 'domcontentloaded' });
        await this.curPage.waitForTimeout(PS_RESPONSE_WAIT_TIME);
      }
      this.logger.log('has login', PlaywrightService.name);
      return Promise.resolve('');
    } catch (err) {
      this.logger.error(err, PlaywrightService.name);
      return Promise.reject('error');
    }
  }

  setCode(smsCode: string) {
    this.smsCode = smsCode;
  }

  setPhone(phone: string) {
    this.phone = phone;
  }

  async checkAttr(
    attr: VALID_INFO_TYPE,
    sseType: SSE_EVENT,
  ): Promise<string | undefined> {
    return new Promise((resolve) => {
      const fun = setInterval(() => {
        // 支持外部中断
        if (this.abort) {
          clearInterval(fun);
          resolve(undefined);
          this.attrCheckCount = 0;
          return;
        }
        if (this.attrCheckCount === 0) {
          this.sseService.sendMessage({
            type: sseType,
            data: {
              message: sseEventMap(sseType),
              second: MAX_CODE_RETRY_COUNT - this.attrCheckCount,
            },
          });
        }
        this.attrCheckCount++;
        console.log(this[attr], this.attrCheckCount);
        if (this[attr]) {
          clearInterval(fun);
          this.attrCheckCount = 0;
          resolve(this[attr]);
          this[attr] = '';
        }
        if (this.attrCheckCount >= MAX_CODE_RETRY_COUNT) {
          clearInterval(fun);
          resolve(undefined);
          this.attrCheckCount = 0;
          this.sseService.sendMessage({
            type: sseType,
            data: { message: '已超时', second: 0 },
          });
        }
      }, 1000);
    });
  }

  update(type: VALID_INFO_TYPE, val: string) {
    switch (type) {
      case VALID_INFO_TYPE.PHONE:
        this.setPhone(val);
        return;
      case VALID_INFO_TYPE.SMS_CODE:
        this.setCode(val);
        return;
    }
  }

  abortAction() {
    this.abort = true;
  }

  showDownloadInfo(
    progressEvent: AxiosProgressEvent,
    sse: SseService,
    title: string,
  ) {
    // 展示下载详情
    const { total, rate = 0, progress } = progressEvent;
    if (total) {
      if (progress !== 1) {
        const text = `总大小: ${(total / 1024 / 1024).toFixed()}M 下载进度: ${(progress * 100).toFixed(2)}% 下载速度: ${(rate / 1024 / 1024).toFixed(2)}Mb/s`;
        sse.sendMessage({
          type: SSE_EVENT.PROCESSING,
          data: {
            message: `${text}`,
            progress: (progress * 100).toFixed(2),
            title,
            total: (total / 1024 / 1024).toFixed(2),
          },
        });
      } else {
        this.logger.log('finish down', PlaywrightService.name);
        this.sseService.sendMessage({
          type: SSE_EVENT.PHASE_FINISH,
          data: {
            message: `下载完成`,
            title,
          },
        });
      }
    }
  }

  test() {
    // this.abort = false;
    // this.checkAttr(VALID_INFO_TYPE.PHONE, SSE_EVENT.NEED_PHONE).then(() => {
    //   this.checkAttr(VALID_INFO_TYPE.SMS_CODE, SSE_EVENT.NEED_SMS_CODE);
    // });
    this.sseService.sendMessage({
      type: SSE_EVENT.PHASE_START_DOWN,
      data: {
        message: `开始下载`,
        title: '99',
      },
    });
    const url =
      'https://download.cloud.189.cn/file/downloadFile.action?dt=71&expired=1736611635386&sid=12444113979727&sk=aa757510-3a3f-4f35-b097-745cc906f220_app&ufi=923771171576518367&zyc=5&token=cloud3&sig=PHAx%2FVr8e0t2LnpQ2gx9uPdBT%2FY%3D';
    handleDownload(url, '.', (event) =>
      this.showDownloadInfo(event, this.sseService, '99'),
    ).catch((e) => {
      this.logger.error(e, PlaywrightService.name);
      this.sseService.sendMessage({
        type: SSE_EVENT.PHASE_ERROR,
        data: {
          message: `下载失败: ${e}`,
          title: '99',
        },
      });
    });
    return {};
  }
}
