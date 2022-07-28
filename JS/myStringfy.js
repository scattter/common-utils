// 实现JSON.stringfy
function jsonStringify(obj) {
  const toString = Object.prototype.toString
  const isArray = Array.isArray || function (a) { return toString.call(a) === '[object Array]'; }
  // 如果是null直接返回null   undefined 和 symbol 会被忽略
  if (obj === null) {
    return 'null'
  } else if (typeof obj === 'number') { // 需要判断是否是无穷大
    return isFinite(obj) ? obj.toString() : 'null'
  } else if (typeof obj === 'boolean') {
    return obj.toString()
  } else if (typeof obj === 'object') {
    if (typeof obj.toJSON === 'function') {
      return jsonStringify(obj.toJSON)
    } else if (isArray(obj)) {
      let res = '['
      for (let i = 0; i < obj.length; i++)
        res += (i ? ', ' : '') + jsonStringify(obj[i]);
      return res + ']'
    } else if (toString.call(obj) === '[object Object]') {
      const tmp = []
      for (let k in obj) {
        if (obj.hasOwnProperty(k)) // hasOwnProperty 重点 只转换可遍历属性
          tmp.push(jsonStringify(k) + ': ' + jsonStringify(obj[k]))
      }
      return '{' + tmp.join(', ') + '}'
    }
  }
}