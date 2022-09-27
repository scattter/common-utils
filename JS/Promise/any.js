// 只要其中一个成功就成功, 当所有的Promise失败才会失败
const myAny = (promises) => {
  const arr = []
  return new Promise(((resolve, reject) => {
    promises.forEach((promise, index) => {
      Promise.resolve(promise).then(resolve, err => {
        arr[index] = { status: 'rejected', val: err }
        Object.keys(arr).length === promises.length && reject(arr)
      })
    })
  }))
}
