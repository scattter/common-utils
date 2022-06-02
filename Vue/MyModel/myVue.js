
class Vue {
  constructor(obj_instance) {
    this.$data = obj_instance.data
    // 数据劫持 监听
    Observe(this.$data)
    // 模板解析  编译函数
    Compile(obj_instance.el, this)
  }
}

// // 数据劫持 监听函数 vue2
function Observe(data_instance) {
  if (!data_instance || typeof data_instance !== 'object') return
  Object.keys(data_instance).forEach(key => {
    // 劫持前保存下当前数据
    let value = data_instance[key]
    // 递归深层次劫持数据
    Observe(value)
    Object.defineProperty(data_instance, key, {
      enumerable: true, // 可枚举
      configurable: true, // 可配置
      set(newValue) {
        console.log(newValue, 'set')
        value = newValue
        // 更新的时候有可能更新为一个对象 或者对象的修改 所以再次进行深层次劫持数据
        Observe(newValue)
      },
      get() {
        console.log(value, 'get')
        return value
      }
    })
  })
}

// HTML模板解析 替换DOM元素
function Compile(element, vm) {
  vm.$el = document.querySelector(element)
  const fragment = document.createDocumentFragment()
  let child  = vm.$el.firstChild;
  while (child) {
    fragment.append(child)
    child  = vm.$el.firstChild
  }
  console.log(fragment)
  console.log(fragment.childNodes)
}
