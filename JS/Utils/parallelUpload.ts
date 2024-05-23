/**
 * 批量发送请求
 */
export class ParallelUpload {
  // 并发请求数
  protected limit = 2;
  // 存储请求序列
  protected requestQueue: Promise<any>[] = [];
  // 当前请求下标
  protected cursor = 0;
  // 需要发送的请求入参
  protected isUploading: boolean = false;
  protected jobs: string[] = [];
  // 外部传入的请求方法
  protected abortControllers: AbortController[] = [];
  protected fn: (job: string, abort?: AbortController) => Promise<any>;
  // 判断是否正在上传
  // 控制请求打断

  constructor(jobs: string | string[], fn: (job: string, abort?: AbortController) => Promise<any>, limit?: number) {
    this.jobs = Array.isArray(jobs) ? jobs : [jobs];
    this.fn = fn;
    limit && (this.limit = limit);
    this.requestQueue = new Array(jobs.length);
  }

  public async start() {
    this.isUploading = true;
    const works = [];
    for (let i = 0; i < this.limit; i++) {
      works.push(this.handle());
    }
    await Promise.allSettled(works);
    const result = [...this.requestQueue];
    this.init();
    return Promise.resolve(result);
  }

  public stop() {
    this.abortControllers.forEach((controller) => controller.abort());
    this.init();
  }

  protected init() {
    this.cursor = 0;
    this.requestQueue = [];
    this.abortControllers = [];
    this.isUploading = false;
  }

  protected async handle() {
    let currentJob;
    while (this.cursor < this.jobs.length) {
      if (!this.isUploading) {
        break;
      }
      try {
        const abort = new AbortController();
        currentJob = this.cursor;
        this.cursor += 1;
        this.abortControllers[currentJob] = abort;
        this.requestQueue[currentJob] = await this.fn(this.jobs[currentJob]!, abort);
      } catch (e) {
        console.log(`job: ${currentJob}`, e);
      }
    }
  }
}

const allRequest = Array.from(Array(10), (v,k) => k.toString());

async function fetchFn(url: string, abort?: AbortController) {
  const time = Math.random() * 2000
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(url, time)
      fetch(`http://localhost:4000/about?index=${url}`, abort).then(response => {
        if (!abort?.signal.aborted) {
          console.log('请求成功，数据：');
        } else {
          console.log('请求被取消');
        }
      })
        .catch(error => {
          if (error.name === 'AbortError') {
            console.log('请求被取消，错误：AbortError', error);
          } else {
            console.error('请求失败，错误：Other', error);
          }
        });
      resolve(url)
    }, time)
  })
}

const parallel = new ParallelUpload(allRequest, fetchFn, 2)

parallel.start()

setTimeout(() => {
  parallel.stop()
}, 1500)





