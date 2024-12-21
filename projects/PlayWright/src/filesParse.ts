import {chromium, devices, Page} from 'playwright';
import {IFileInfo} from "./interfaces";
import {handleDownload} from "./UrlDownload";

// 嗜血法医 1-8季 中英字幕 转载于网络收集
// 链接：https://cloud.189.cn/t/iueYzmJruqMz

const url = 'https://cloud.189.cn/t/iueYzmJruqMz'
const downloadUrl2 = 'https://cloud.189.cn/t/VrEvMrN32uUj'

export class FileParseAndDown {
  // 解析后的数据
  private parsedData: IFileInfo[] = []
  private curPage: Page | undefined;
  // 分享的id (如果走模拟下载就不用这个参数)
  // private shareId: number | undefined;
  // 链接地址
  private downloadUrl: string;
  // 手机号
  private phone: number;
  // 分享链接打开的密码
  private sharePwd: string | undefined;
  // 短信验证码
  private smsCode: number | string = '';
  // 短信验证码的检查次数
  private smsCheckCount: number = 0

  constructor(downloadUrl: string, phone: number, sharePwd?: string) {
    this.downloadUrl = downloadUrl;
    this.phone = phone;
    this.sharePwd = sharePwd
  }

  updateParsedData(data: IFileInfo[]) {
    this.parsedData = data
  }

  async init() {
    // Setup
    const browser = await chromium.launch({
      headless: false,
    });
    const s9 = devices['Galaxy S9+'];
    const context = await browser.newContext({
      ...s9,
    });
    const page = await context.newPage()
    await page.goto(this.downloadUrl, { waitUntil: 'domcontentloaded' });
    this.curPage = page;
    await page.waitForTimeout(500)
    if (this.sharePwd) {
      await this.inputValidCode()
    }
  }

  async inputValidCode() {
    if (!this.sharePwd || !this.curPage) return
    const accessCode = this.curPage.locator('.access-code-input')
    const accessBtn = this.curPage.locator('.button')
    await accessCode.fill(this.sharePwd)
    await accessBtn.click();
  }

  async parseFiles() {
    if (!this.curPage) return

    await this.findAllFile(this.curPage, this.parsedData, true)
    console.log(this.parsedData)
    await this.downloadFile(this.parsedData)
  }

  async findAllFile(page: Page, data: IFileInfo[], isRoot?: boolean) {
    const response = await page.waitForResponse(/listShareDir/, { timeout: 3000 });
    const res = await response.json()
    await page.waitForTimeout(1000)
    if (res.res_code !== 0) {
      return;
    }
    const { folderList, fileList } = res.fileListAO;
    const fileInfosLocator = page.locator('.file-right')
    const allLocator = await fileInfosLocator.all()
    for await (const locator of allLocator) {
      const titleLocator = locator.locator('.name')
      const title = await titleLocator.innerText()
      const target = folderList.concat(fileList).find((item: any) => item.name === title)
      if (!target.mediaType) {
        const temp: IFileInfo = {
          type: 'folder',
          name: title,
          id: target.id,
          children: [],
          checked: false
        }
        data.push(temp)
        // 进入遍历里面的文件夹
        await locator.click()
        await this.findAllFile(page, temp.children, false)
      } else {
        data.push({
          type: 'file',
          name: title,
          id: target.id,
          children: [],
          checked: !!isRoot
        })
      }
    }
    if (!isRoot) await page.goBack()
  }

  async downloadFile(data: IFileInfo[]) {
    if (!this.curPage) return;
    const fileInfosLocator = this.curPage.locator('.file-right')
    const allLocator = await fileInfosLocator.all()
    for await (const locator of allLocator) {
      const title = await locator.locator('.file-info .name').innerText()
      const item = data.find(v => v.name === title)
      if (item?.checked) {
        if (item.type === 'folder') {
          await this.downloadFile(item.children)
        } else {
          // 选中文件
          const fileBtn = locator.locator('.file-right-icon-wrap')
          await fileBtn.click()
          await this.curPage.waitForTimeout(500)
          // 触发下载
          const downloadBtns = await this.curPage.locator('.operate-item').all()
          if (downloadBtns.length < 3) return
          const downloadBtn = downloadBtns[1]
          const text = await downloadBtn.allInnerTexts()
          await downloadBtn.click()
          // 监听下载事件
          // const downloadPromise = this.curPage.waitForEvent('download', { timeout: 10 * 1000 });

          // 检查是否需要登陆
          const firstLogin = await this.checkLogin()
          // 监听下载事件
          const downloadPromise = this.curPage.waitForEvent('download', { timeout: 10 * 1000 });
          // 重复触发
          if (firstLogin) {
            // 选中文件
            const fileBtn = locator.locator('.file-right-icon-wrap')
            await fileBtn.click()
            await this.curPage.waitForTimeout(500)
            // 触发下载
            const downloadBtns = await this.curPage.locator('.operate-item').all()
            if (downloadBtns.length < 3) return
            const downloadBtn = downloadBtns[1]
            const text = await downloadBtn.allInnerTexts()
            await downloadBtn.click()
          }

          // 等待接口返回, 查看下载链接
          const response = await this.curPage.waitForResponse(/getFileDownloadUrl/, { timeout: 3* 1000 })
          const res = await response.json()
          // 取消浏览器的下载行为
          const download = await downloadPromise;
          await download.cancel()
          // 取消选中
          await fileBtn.click()
          if (res.res_code === 0) {
            const fileDownloadUrl = res.fileDownloadUrl;
            console.log(fileDownloadUrl)
            handleDownload(fileDownloadUrl, '.')
          }
        }
      }
    }
    return
  }

  async checkLogin() {
    try {
      if (!this.curPage) return
      const popEle = await this.curPage.waitForSelector('.error-pop', { timeout: 1000 })
      if (popEle) {
        const phoneLogin = await this.curPage.locator('.ok-btn')
        await phoneLogin.click()

        const phoneInput = await this.curPage.locator('#j-sms-userName');
        const codeInput = await this.curPage.locator('#j-sms-password');
        const loginSubmit = await this.curPage.locator('#j-sms-submit');
        const codeTrigger = await this.curPage.locator('#j-sms-send');
        const checked = await this.curPage.locator('#j-agreement-checkbox-sms');

        await checked.click()
        await phoneInput.fill(this.phone.toString())
        await this.curPage.waitForTimeout(500)
        await codeTrigger.click()

        const phoneLogin2 = await this.curPage.locator('.ok-btn')
        await phoneLogin2.click()

        const smsCode = await this.checkCode()
        if (smsCode) {
          await codeInput.fill(smsCode.toString())
          await loginSubmit.click()
          await this.curPage.waitForTimeout(3 * 1000)
        }
      }
      return !!popEle
    } catch {}
  }

  setCode(smsCode: string | number) {
    this.smsCode = smsCode
  }

  async checkCode(): Promise<string | number | undefined> {
    return new Promise((resolve) => {
      const fun = setInterval(() => {
        this.smsCheckCount++
        if (this.smsCode) {
          clearInterval(fun)
          resolve(this.smsCode)
          this.smsCheckCount = 0
        }
        if (this.smsCheckCount >= 60) {
          clearInterval(fun)
          resolve(undefined);
          this.smsCheckCount = 0
        }
      }, 1000)
    })
  }
}