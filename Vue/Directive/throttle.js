const myThrottle = {
  bind(el, binding) {
    // 获取用户设置的防抖时间
    let time = binding.value;
    // 如果用户没有设置, 就给默认值
    if (!time) {
      time = 2000
    }
    
    let timer = null
    // 目前该api第三个参数已经改为options选项, 以支持更多参数配置
    // 如果按照老的api, 在这里添加boolean值, 那么表示其是否在捕获阶段调用事件处理程序
    el.addEventListener('click', event => {
      // 如果当前定时器没有值, 表示
      if (!timer) {
        timer = setTimeout(() => {
          timer = null
          // stopImmediatePropagation阻止后续click事件的触发
          // 如果后续有其他事件. 不会再被触发
          event && event.stopImmediatePropagation()
        }, time)
      }
    })
  }
}

export default myThrottle
