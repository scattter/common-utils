import {chromium, devices} from "playwright";

const url = 'https://h5.cloud.189.cn/'

export class FakeLogin {
  private code: number | string = ''
  private phone: number | string
  private checkCount: number = 0

  constructor(phone: string | number) {
    this.phone = phone
  }

  setCode(code: string | number) {
    this.code = code
  }

  async checkCode(): Promise<string | number | undefined> {
    return new Promise((resolve) => {
      const fun = setInterval(() => {
        this.checkCount++
        if (this.code) {
          clearInterval(fun)
          resolve(this.code)
        }
        if (this.checkCount >= 60) {
          clearInterval(fun)
          resolve(undefined);
        }
      }, 1000)
    })
  }

  async login() {
    // Setup
    const browser = await chromium.launch({
      headless: false,
    });
    const iphone13 = devices['iPhone 13'];
    const context = await browser.newContext({
      ...iphone13,
    });
    const page = await context.newPage()
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.home-container', { timeout: 2000 });
    const loginBtn = await page.locator('.smart-network-btn')
    await loginBtn.click()

    await page.waitForSelector('.error-pop', { timeout: 2000 })
    const phoneLogin = await page.locator('.ok-btn')
    await phoneLogin.click()

    const phoneInput = await page.locator('#j-sms-userName');
    const codeInput = await page.locator('#j-sms-password');
    const loginSubmit = await page.locator('#j-sms-submit');
    const codeTrigger = await page.locator('#j-sms-send');
    const checked = await page.locator('#j-agreement-checkbox-sms');

    await checked.click()
    await phoneInput.fill('18339939706')
    await page.waitForTimeout(500)
    await codeTrigger.click()

    const phoneLogin2 = await page.locator('.ok-btn')
    await phoneLogin2.click()

    const code = await this.checkCode()
    if (code) {
      await codeInput.fill(code.toString())
      await loginSubmit.click()
    }
  }
}