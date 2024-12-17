import { chromium, devices } from 'playwright';

// 嗜血法医 1-8季 中英字幕 转载于网络收集
// 链接：https://cloud.189.cn/t/iueYzmJruqMz

const url = 'https://cloud.189.cn/t/iueYzmJruqMz'

async function fileParse() {
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

  // const res = await page.waitForURL(/listShareDir/, { timeout: 2000 })
  const responsePromise = page.waitForResponse(/listShareDir/, { timeout: 2000 });
  const response = await responsePromise;
  const res = await response.json()
}
fileParse()