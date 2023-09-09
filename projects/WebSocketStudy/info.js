const os = require('os');

// 获取当前时刻CPU的信息，返回空闲时间和总时间
// 这里简单地把所有CPU的耗时累加了，严谨地计算应该单独计算每个cpu的时间，求出每个cpu的使用率
const getCPUInfo = () => {
  return os.cpus().map((info) => {
    return {
      idle: info.times.idle,
      total: info.times.user + info.times.nice + info.times.sys + info.times.idle + info.times.irq
    };
  }).reduce((pre, cur) => {
    return {
      idle: pre.idle + cur.idle,
      total: pre.total + cur.total,
    };
  }, { idle: 0, total: 0 });
}

let start = getCPUInfo();
// 通过两个时间点的cpu用时信息，计算出该时间段内cpu用的使用时间和使用率
function getCPUUsage() {
  const end = getCPUInfo();
  const idle = end.idle - start.idle;
  const total = end.total - start.total;
  start = end;
  return ((1 - idle / total) * 100).toString().substring(0, 5) + '%' // 0 ~ 1的数字, 如0.5代表50%使用率;
}

const getAllInfo = () => {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  // console.log('总内存量：', totalMemory / 1024);
  // console.log('空闲内存量：', freeMemory / 1024);
  const usage = getCPUUsage();
  return { usage, totalMemory: totalMemory / 1024, freeMemory: freeMemory / 1024 }
}

module.exports = {
  getAllInfo
}