// 下题输出的结果
Promise.resolve().then(() => {
  console.log('1')
  return Promise.resolve().then(() => console.log('2'))
}).then(() => {
  console.log('3')
})

Promise.resolve().then(() => {
  console.log('1')
  return Promise.resolve().then(() => {
    console.log('2')
    Promise.resolve().then(() => {
      console.log('4')
    })
  })
}).then(() => {
  console.log('3')
})

// Promise.resolve()和Promise.catch() 都是返回的Promise对象, 后面都可以继续then或者catch, finally也一样
// 如果是new Promise, 那么如果在后续的then或者catch中不进行resolve和reject, 就不会继续向下执行, 会进入一个pending状态
function foo() {
  return new Promise(((resolve, reject) => {
    console.log('1')
    return Promise.resolve().then(() => console.log('2'))
  })).then(() => {
    console.log('3')
  })
}

function foo2() {
  return new Promise(((resolve, reject) => {
    console.log('1')
    return Promise.resolve().then(() => {
      console.log('2')
      resolve(4)
    })
  })).then(() => {
    console.log('3')
  }).finally(() => {
    console.log('finally')
  }).then(() => {
    console.log('5')
  })
}

function foo3() {
  return new Promise(((resolve, reject) => {
    console.log('1')
    resolve(4)
    return Promise.resolve().then(() => console.log('2'))
  })).then(() => {
    console.log('3')
  })
}

function bar() {
  return Promise.resolve().then(() => {
    console.log('1')
    return Promise.resolve().then(() => {
      console.log('2')
      setTimeout(() => console.log('setTimeout'))
    })
  }).then(() => {
    console.log('3')
  })
}