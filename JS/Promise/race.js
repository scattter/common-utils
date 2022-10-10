// 传入Promise数组, 哪个Promise先执行完就返回哪个Promise的
const myRace = (promises) => {
  return new Promise(((resolve, reject) => {
    promises.forEach(promise => {
      Promise.resolve(promise).then(res => resolve(res), reject)
    })
  }))
}
