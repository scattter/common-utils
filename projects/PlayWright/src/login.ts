import { chromium, devices } from 'playwright';
// const { chromium } = require('playwright')
// https://s.weibo.com/top/summary?cate=realtimehot
// https://cloud.189.cn/web/login.html
// https://sit.meijian.com/
// https://open.e.189.cn/api/logbox/separate/wap/login.html
// https://h5.cloud.189.cn/

const url = 'https://h5.cloud.189.cn/'

export async function login(code: Promise<number>) {
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
  const codeTrigger = await page.locator('#j-sms-send');
  const checked = await page.locator('#j-agreement-checkbox-sms');

  await checked.click()
  await phoneInput.fill('18339939706')
  await page.waitForTimeout(500)
  await codeTrigger.click()

  new Promise((resolve) => {
    setTimeout(() => {
      resolve(code)
    }, 1000 * 10)
  })



  // const phoneInput = await page.locator('#j-sms-userName');
  // await phoneInput.fill('112312332', { force: true, timeout: 1000 })
  // await page.waitForTimeout(1000)
  // const texts = await phoneInput.innerHTML()
  // console.log(texts, '---', bb)

  // Teardown
  // await browser.close();
}