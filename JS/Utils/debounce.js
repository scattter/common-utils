// 规定时间触发一次
const debounce = (fn, wait) => {
  let timeout;
  
  return function() {
    let context = this
    let args = arguments
    
    // 重新计时
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn.call(context, args)
    }, wait)
  }
}

// 无论触发多少次, 都是每间隔固定时间触发一次
const throttling = (fn, wait) => {
  let timeout
  
  return function() {
    let context = this
    let args = arguments
    
    if (!timeout) {
      timeout = setTimeout(() => {
        fn.call(context, args)
        timeout = null
      }, wait)
    }
  }
}
