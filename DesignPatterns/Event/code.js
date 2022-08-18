module.exports = {
  Event
}

class Event {
  constructor() {
    this._cache = {}
  }

  on(eventName, cb) {
    // 添加事件与回调
    const cbs = (this._cache[eventName] = this._cache[eventName] || [])
    if (cbs.indexOf(cb) === -1) {
      cbs.push(cb)
    }
    return this
  }

  emit(eventName, data) {
    const cbs = this._cache[eventName]
    if (Array.isArray(cbs)) {
      cbs.forEach(fn => {
        fn(data)
      })
    }
    return this
  }

  off(eventName, cb) {
    const cbs = this._cache[eventName]
    if (Array.isArray(cbs)) {
      // 如果指定移除哪个回调, 那么就移除指定回调
      // 否则移除所有回调
      if (cb) {
        const index = cbs.indexOf(cb)
        if (index !== -1) cbs.splice(index, 1)
      } else {
        cbs.length = 0
      }
    }
    return this
  }
}