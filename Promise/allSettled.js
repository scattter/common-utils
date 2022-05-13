const myAllSettled = (promises) => {
  const arr = []
  return new Promise(((resolve, reject) => {
    promises.forEach((promise, index) => {
      Promise.resolve(promise).then(res => {
        arr[index] = res
        // 当所有promise都执行完后再返回结果
        Object.keys(arr).length === promises.length && resolve(arr)
      }, err => {
        arr[index] = { status: 'rejected', val: err }
        Object.keys(arr).length === promises.length && reject(arr)
      })
    })
  }))
}
