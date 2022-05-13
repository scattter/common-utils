const debounce = (fn, wait) => {
  let timeout;
  
  return function() {
    let context = this
    let args = arguments
    
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn.call(context, args)
    }, wait)
  }
}

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
