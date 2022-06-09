// 代码整体部分参考B站up主: 技术蛋老师(id: 327247876)

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
  const dependency = new Dependency()
  Object.keys(data_instance).forEach(key => {
    // 劫持前保存下当前数据
    let value = data_instance[key]
    // 递归深层次劫持数据
    Observe(value)
    Object.defineProperty(data_instance, key, {
      enumerable: true, // 可枚举
      configurable: true, // 可配置
      set(newValue) {
        value = newValue
        // 更新的时候有可能更新为一个对象 或者对象的修改 所以再次进行深层次劫持数据
        Observe(newValue)
        // 通知订阅者可以开始更新了
        dependency.notify()
      },
      get() {
        // 订阅者加入依赖实例的数组
        Dependency.temp && dependency.addSub(Dependency.temp)
        return value
      }
    })
  })
  console.log(dependency)
}

// HTML模板解析 替换DOM元素
function Compile(element, vm) {
  vm.$el = document.querySelector(element)
  // 创建了一虚拟的节点对象，节点对象包含所有属性和方法。
  // 当你想提取文档的一部分，改变，增加，或删除某些内容及插入到文档末尾可以使用createDocumentFragment() 方法
  // 文档片段存在于内存中，并不在DOM树中，所以将子元素插入到文档片段时不会引起页面回流
  const fragment = document.createDocumentFragment()
  let child  = vm.$el.firstChild;
  while (child) {
    // fragment append方法会将目标对象此处值置为空
    // Inserts nodes after the last child of node, while replacing strings in nodes with equivalent Text nodes
    fragment.append(child)
    child  = vm.$el.firstChild
  }
  fragment_complie(fragment)

  function fragment_complie(node) {
    const pattern = /\{\{\s*(\S+)\s*\}\}/
    // 数据影响视图
    // 这里寻找插值表达式并替换, 插值表达式的节点类型是TEXT_NODE -> 3
    if (node.nodeType === 3) {
      const result = pattern.exec(node.nodeValue)
      const xxx = node.nodeValue
      if (result) {
        const arr = result[1].split('.')
        const nodeValue = arr.reduce((data, key) => data[key], vm.$data)
        // 使用真实内容替换节点的插值表达式
        node.nodeValue = xxx.replace(pattern, nodeValue)
        // 创建订阅者
        new Watcher(vm, result[1], newValue => {
          node.nodeValue = xxx.replace(pattern, newValue)
        })
      }
      return
    }
    // 视图影响数据
    // 查找input输入框 v-model绑定
    if (node.nodeType === 1 && node.nodeName === 'INPUT') {
      // 获取节点上的属性数组
      const attrs = Array.from(node.attributes)
      attrs.forEach(attr => {
        if (attr.nodeName === 'v-model') {
          // 更新节点的值 将绑定的数据赋值给input输入框
          node.value = attr.nodeValue.split('.').reduce(
              (data, cur) => data[cur], vm.$data
          )
          // 添加订阅者
          new Watcher(vm, attr.nodeValue, newValue => {
            node.value = newValue
          })
          // 设置监听函数 将其与节点上的值绑定在一起
          node.addEventListener('input', e => {
            // 将xx.xx.pp转换为['xx', 'xx', 'pp']
            const allKeyList = attr.nodeValue.split('.')
            // 将['xx', 'xx']提取出来
            const preKeyList = allKeyList.slice(0, allKeyList.length - 1)
            // 将vm.$data.xx.xx取出来
            const final = preKeyList.reduce(
                (data, cur) => data[cur], vm.$data
            )
            // 再获取vm.$data.xx.xx.pp
            final[allKeyList[allKeyList.length - 1]] = e.target.value
          })
        }
      })
    }
    // 遍历当前的node节点 逐次将其进行处理
    node.childNodes.forEach(child => fragment_complie(child))
  }
  // 将处理完毕的fragment添加到实例的dom中
  vm.$el.appendChild(fragment)
}

// 依赖 收集和通知订阅者
class Dependency {
  constructor() {
    this.subscribers = []
  }

  addSub(sub) {
    this.subscribers.push(sub)
  }

  notify() {
    this.subscribers.forEach(sub => sub.update())
  }
}

// 订阅者
class Watcher {
  constructor(vm, key, callback) {
    this.vm = vm
    this.key = key
    this.callback = callback
    // 临时属性 - 触发getter
    Dependency.temp = this
    // 通过访问该属性触发getter 将当前key加入到watcher中
    key.split('.').reduce((data, cur) => data[cur], vm.$data)
    // 防止订阅者多次加入到依赖实例数组里面
    Dependency.temp = null
  }

  update() {
    // 回调参数
    const newValue = this.key.split('.').reduce(
        (data, cur) => data[cur], this.vm.$data
    )
    this.callback(newValue)
  }
}