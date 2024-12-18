import {chromium, devices, Page} from 'playwright';
import {IFileInfo} from "./interfaces";
import {raw} from "express";

// 嗜血法医 1-8季 中英字幕 转载于网络收集
// 链接：https://cloud.189.cn/t/iueYzmJruqMz

const url = 'https://cloud.189.cn/t/iueYzmJruqMz'
const downloadUrl2 = 'https://cloud.189.cn/t/VrEvMrN32uUj'

export class FileParseAndDown {
  private parsedData: IFileInfo[] = []
  private curPage: Page | undefined;
  private shareId: number | undefined;
  constructor() {
  }

  updateParsedData(data: IFileInfo[]) {
    this.parsedData = data
  }

  async init() {
    // Setup
    const browser = await chromium.launch({
      headless: false,
    });
    const iphone13 = devices['iPhone 13'];
    const context = await browser.newContext({
      ...iphone13,
    });
    const page = await context.newPage()
    await page.goto(downloadUrl2, { waitUntil: 'domcontentloaded' });
    this.curPage = page;
    await page.waitForTimeout(500)
  }

  async parseFiles() {
    if (!this.curPage) return
    const accessCode = this.curPage.locator('.access-code-input')
    const accessBtn = this.curPage.locator('.button')
    await accessCode.fill('0lwf')
    await accessBtn.click();

    const shareResponse = await this.curPage.waitForResponse(/checkAccessCode/, { timeout: 3000 });
    const shareInfo = await shareResponse.json()
    console.log(shareInfo)
    if (shareInfo.res_code === 0) {
      this.shareId = shareInfo.shareId
    }
    await this.findAllFile(this.curPage, this.parsedData, true)
    console.log(this.parsedData, this.shareId)
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
    if (!this.curPage || !this.shareId) return;
    for await (const item of data) {
      console.log(item)
      if (item?.checked) {
        if (item.type === 'folder') {
          await this.downloadFile(item.children)
        } else {
          // const response =
          //   await this.curPage.request.get(
          //     `https://api.cloud.189.cn/open/file/getFileDownloadUrl.action?fileId=${item.id}&dt=1&shareId=${this.shareId}`
          //   )
          // const res = await response.json()
          // console.log(res, '=====')
          // if (res.res_code === 0) {
          //   console.log(res.fileDownloadUrl)
          // }
          // await this.curPage.waitForTimeout(1000)
        }
      }
    }
    return
  }
}
(async () => {
  const a = new FileParseAndDown()
  await a.init()
  await a.parseFiles()
})()