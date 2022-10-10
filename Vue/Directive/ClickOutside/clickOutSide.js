const on = (function () {
  // 兼容不同的浏览器事件监听
  return function (element, event, handler) {
    if (document.addEventListener) {
      if (element && event && handler) element.addEventListener(event, handler, false)
    } else {
      element.attachEvent('on' + event, handler)
    }
  }
})()

let seed = 0
let startClick
let nodeLists= []
const ctx = '@@clickOutsideZK'

on(document, 'mousedown', (e) => (startClick = e))
on(document, 'mouseup', (e) => {
  nodeLists.forEach(node => node[ctx].documentHandler(e, startClick))
})

const createDocumentHandler = (el, binding, vnode) => {
  console.log(el, vnode)
  // 返回闭包 在mouseup的时候传入相应事件
  return function (mouseup = {}, mousedown = {}) {
    // 这里可以对popperElm进行操作, 来处理特殊元素的clickOutside事件
    // el是当前DOM元素  vnode是vue编译生成的虚拟节点 其elm属性和el相等
    // vnode的context则是当前元素所在的上下文环境 其是一个VueComponent实例
    // this指向的是vnode.context 里面有$refs这些
    // 如果想自定义不触发outside的逻辑  可以自己在上下文里面添加popperElm属性进行相应控制
    if (!vnode ||
      !vnode.context ||
      !mouseup.target ||
      !mousedown.target ||
      el.contains(mouseup.target) ||
      el.contains(mousedown.target) ||
      el === mouseup.target ||
      (vnode.context.popperElm &&
        (vnode.context.popperElm.contains(mouseup.target) ||
          vnode.context.popperElm.contains(mousedown.target))
      )
    ) return

    // 如果绑定了表达式 && 当前元素上有相应的属性 &&
    // ? 为什么先使用了vnode节点上的
    if (binding.expression &&
      el[ctx].documentMethod &&
      vnode.context[el[ctx].documentMethod]
    ) {
      vnode.context[el[ctx].documentMethod]();
    } else {
      el[ctx].documentFn && el[ctx].documentFn()
    }
  }
}

const clickOutside = {
  bind(el, binding, vnode) {
    // 加入对应的数组中, handle多个outside情况
    nodeLists.push(el)
    const id = seed++
    el[ctx] = {
      id,
      documentHandler: createDocumentHandler(el, binding, vnode),
      documentMethod: binding.expression,
      documentFn: binding.value
    }
  },
  update(el, binding, vnode) {
    el[ctx].documentHandler = createDocumentHandler(el, binding, vnode)
    el[ctx].documentMethod = binding.expression
    el[ctx].documentFn = binding.value
  },
  unbind(el) {
    const len = nodeLists.length
    for (let i = 0; i < len; i++) {
      // console.log(nodeLists[i][ctx].id, el[ctx].id)
      if (nodeLists[i][ctx].id === el[ctx].id) {
        nodeLists.splice(i, 1)
        break
      }
    }
    delete el[ctx]
  }
}
export default clickOutside