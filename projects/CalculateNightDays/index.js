const dayjs = require('dayjs')
const fs = require('fs')

// 文件里面放打卡接口的响应结果
let raw = fs.readFileSync('data.json')
let res = JSON.parse(raw)

// let start = '2021-06-01 08:52:36'
// let end = '2021-06-01 19:31:34'

const hasOverTime = (start, end) => {
  return dayjs(end).diff(start, 'minute') > 60 * 10
}

let result = 0, dates = {}
const responses = res.dataObject.dataList[0].dataList

responses.forEach(response => {
  const time = response[4]
  const day = time.split(' ')[0]
  dates[day] = [response[4], response[5]]
})
Object.values(dates).forEach(([start, end]) => {
  if (hasOverTime(start, end)) {
    console.log(start, end)
  }
  result += hasOverTime(start, end)
})
console.log(result)
