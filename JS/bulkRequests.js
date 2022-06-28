
const allRequest = Array.from(Array(20), (v,k) =>k);
// const allRequest = [
//   "https://dog-facts-api.herokuapp.com/api/v1/resources/dogs?index=1",
//   "https://dog-facts-api.herokuapp.com/api/v1/resources/dogs?index=2",
//   "https://dog-facts-api.herokuapp.com/api/v1/resources/dogs?index=3",
//   "https://dog-facts-api.herokuapp.com/api/v1/resources/dogs?index=4",
//   "https://dog-facts-api.herokuapp.com/api/v1/resources/dogs?index=5",
//   "https://dog-facts-api.herokuapp.com/api/v1/resources/dogs?index=6",
//   "https://dog-facts-api.herokuapp.com/api/v1/resources/dogs?index=7",
//   "https://dog-facts-api.herokuapp.com/api/v1/resources/dogs?index=8",
//   "https://dog-facts-api.herokuapp.com/api/v1/resources/dogs?index=9",
//   "https://dog-facts-api.herokuapp.com/api/v1/resources/dogs?index=10",
// ]

async function fetch(url) {
  return new Promise(resolve => {
    setTimeout(() => resolve(url), Math.random() * 500)
  })
}

function sendRequest(urls, max, callback) {
  // 缓存请求队列
  const bulkQueue = []
  // 总请求数
  const totalNums = urls.length
  // 当前请求第几个, 已经完成多少个请求
  let currentReqNum = 0, finishReqNum = 0
  // 保存请求后的结果
  const results = new Array(totalNums).fill(false)

  // 主函数
  async function init() {
    for (let i = 0; i < totalNums; i++) {
      console.log('for', i, '-----', currentReqNum)
      // if (currentReqNum >= max) {
      //   // pending状态的promise
      //   await new Promise((resolve) => {
      //     bulkQueue.push(resolve)
      //   })
      // }
      // await handleReq(i, urls[i])
      request(i, urls[i])
    }
  }

  // 主要处理缓存请求队列的问题
  async function request(index, url) {
    // 如果当前请求数量大于批量请求数量
    // 就将其添加到缓存队列 阻塞后面的handleReq
    if (currentReqNum >= max) {
      // pending状态的promise
      await new Promise((resolve) => {
        bulkQueue.push(resolve)
      })
    }
    console.log('3')
    // 这里由于上面的await, 所以被阻塞了  存入了一个队列中
    handleReq(index, url)
  }

  // 结束一个旧的请求 再开始一个新的请求
  async function handleReq(index, url) {
    // 当前请求数 + 1
    currentReqNum++
    // 等待当前请求结束
    try {
      results[index] = await fetch(url)
    } catch (err) {
      results[index] = err
    } finally {
      currentReqNum--
      finishReqNum++
      // 上一个请求结束 那就发送新的请求
      // 然后再将这个新的请求从队列里面移除出去
      if (bulkQueue.length) {
        console.log('1')
        // 这里执行resolve 触发新的handleReq
        bulkQueue[0]()
        console.log('2')
        bulkQueue.shift()
      }
      // 如果所有的都处理完了 那么调用回调函数
      if (finishReqNum === totalNums) {
        callback(results)
      }
    }
  }

  init()
}

sendRequest(allRequest, 3, results => console.log(results))

// 另一种实现方式
// https://zhuanlan.zhihu.com/p/360193435
async function parallel(jobs, fn, workerCount = 5) {
  const ret = new Array(jobs.length);

  let cursor = 0;
  async function worker(workerId) {
    let currentJob;
    while (cursor < jobs.length) {
      try {
        currentJob = cursor;
        cursor += 1;
        ret[currentJob] = await fn(jobs[currentJob]);
      } catch (e) {
        console.log(`worker: ${workerId} job: ${currentJob}`, e);
      }
    }
  }

  const workers = [];

  for (let i = 0; i < workerCount && i < jobs.length; i += 1) {
    workers.push(worker(i));
  }

  await Promise.all(workers);

  return ret;
}
const results = await parallel(allRequest, (url) => fetch(url), 5)