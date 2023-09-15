/**
 * 自动更新 aria2 tracker
 * 本地部署了aria2下载, 借助青龙面板更新tracker
 */

const axios = require('axios')
const fs = require("fs");

/**
 * 获取最新的 tracker
 */
const getLastTracker = () => {
  return axios('https://raw.githubusercontent.com/ngosang/trackerslist/master/trackers_best_ip.txt', {
    headers: {
      Accept: '*/*',
    }
  }).then(res => {
    const tracker = res.data.replace(/\n\n/g, ',').toString()
    return tracker.substring(0, tracker.length - 2)
  }).catch(err => {
    throw new Error(err)
  })
}

/**
 * 更新 本地tracker
 */
const updateTracker = (path, value) => {
  let file = fs.readFileSync(path, 'utf-8')
  file= file.replace(/bt-tracker=\w+/g, `bt-tracker=${value}`)
  fs.writeFileSync(path, file)
}

getLastTracker().then(res => {
  updateTracker('test.conf', res)
})