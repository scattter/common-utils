const arrs1 = [
  { id: 1, pid: 0, title: 'html' },
  { id: 2, pid: 1, title: 'body' },
  { id: 3, pid: 2, title: 'div' },
  { id: 4, pid: 2, title: 'div' },
  { id: 5, pid: 3, title: 'a' },
  { id: 6, pid: 3, title: 'a' },
  { id: 7, pid: 5, title: 'span' }
]

// 该方法主要是用来进行将后端返回的线性数据转为树状数据
const format = (arrs) => {
  const ids = {}
  // 保存对应id的值  便于后面遍历的时候寻找父项
  arrs.forEach(arr => {
    ids[arr.id] = arr
  })

  const treeNode = {}
  arrs.forEach(arr => {
    // 寻找当前项的父项, 如果没有的话说明父项是treeNode (这里利用了浅复制的特性)
    const parent = ids[arr.pid] || treeNode
    // 寻找当前项的父项是否还有其他子项 如果没有的话那么就初始化子项
    parent.children = parent.children || []
    // 将当前项塞进去
    parent.children.push(arr)
  })

  return treeNode.children
}

console.log(format(arrs1))