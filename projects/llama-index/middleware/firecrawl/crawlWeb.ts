import axios, {AxiosResponse} from "axios";
import {ICrawlOption} from "@/app/interface/crawl";

const DEFAULT_CRAWL_OPTION: ICrawlOption = {
  excludes: ['blog/'],
  includes: [], // leave empty for all pages
  limit: 5,
}
export async function crawlMain(crawlUrl: string, options?: ICrawlOption) {
  try {
    // Crawl a website
    const params = {
      url: crawlUrl,
      crawlerOptions: {...DEFAULT_CRAWL_OPTION, ...options},
      pageOptions: {
        onlyMainContent: true
      }
    };

    const res = await axios.post('http://127.0.0.1:3002/v0/crawl', params)
    // 循环调用返回最终结果
    while (true) {
      const statusResponse: AxiosResponse = await axios.get(`http://127.0.0.1:3002/v0/crawl/status/${res.data.jobId}`)
      if (statusResponse.status === 200) {
        const statusData = statusResponse.data;
        if (statusData.status === 'completed') {
          if ('data' in statusData) {
            return statusData.data;
          } else {
            return []
          }
        } else if (['active', 'paused', 'pending', 'queued'].includes(statusData.status)) {
          await new Promise(resolve => setTimeout(resolve, 2 * 1000)); // Wait for the specified timeout before checking again
        } else {
          return [];
        }
      } else {
        return []
      }
    }
    // return await app.crawlUrl(crawlUrl, params);
  } catch (error: any) {
    console.error('An error occurred:', error.message);
  }
}
