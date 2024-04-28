import axios from "axios";

export async function scrapeMain(scrapeUrl: string) {
  try {
    // Crawl a website
    const params = {
      mode: 'scrape',
      url: scrapeUrl,
    };

    const result = await axios.post('http://127.0.0.1:3002/v0/scrape', params)
    return result.data.data
    // return await app.crawlUrl(crawlUrl, params);
  } catch (error: any) {
    console.error('An error occurred:', error.message);
  }
}