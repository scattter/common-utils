// 传入promise数组, 返回的也是promise结果数组, 如果中间有一个报错, 那么也是会报错的
const myAll = (promises) => {
  const arr =[]
  return new Promise((resolve, reject) => {
    promises.forEach((promise, index) => {
      Promise.resolve(promise).then(res => {
        // 保证返回的promise结果数组和传入的数组顺序一致
        arr[index] = res
        // 当所有promise都执行完后再返回结果
        Object.keys(arr).length === promises.length && resolve(arr)
      }, reject)
    })
  })
}

// case
// 作者：滑稽鸭
// 链接：https://juejin.cn/post/7069805387490263047
//   来源：稀土掘金
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
const p1 = Promise.resolve('p1')
const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('p2 延时一秒')
  }, 1000)
})
const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('p3 延时两秒')
  }, 2000)
})

const p4 = Promise.reject('p4 rejected')

const p5 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('p5 rejected 延时1.5秒')
  }, 1500)
})

// 所有 Promise 都成功
myAll([p1, p2, p3])
  .then(res => console.log(res))
  .catch(err => console.log(err)) // 2秒后打印 [ 'p1', 'p2 延时一秒', 'p3 延时两秒' ]

// 一个 Promise 失败
myAll([p1, p2, p4])
  .then(res => console.log(res))
  .catch(err => console.log(err)) // p4 rejected

// 一个延时失败的 Promise
myAll([p1, p2, p5])
  .then(res => console.log(res))
  .catch(err => console.log(err)) // 1.5秒后打印 p5 rejected 延时1.5秒

// 两个失败的 Promise
myAll([p1, p4, p5])
  .then(res => console.log(res))
  .catch(err => console.log(err)) // p4 rejected
