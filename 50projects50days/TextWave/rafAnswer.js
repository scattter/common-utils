// 添加节点
const rafArea = document.getElementsByClassName('nodes-raf')[0]
const rfaContent = 'this is requestAnimationFrame area page'
let rafEle = document.createDocumentFragment()
rfaContent.split('').map((text, index) => {
  let fragment = document.createElement('span')
  fragment.className = 'wave-node-raf'
  if (text === ' ') {
    fragment.style.width = '4px'
  }
  fragment.style.display = 'inline-block'
  fragment.style.height = '100px'
  fragment.style.lineHeight = '100px'
  fragment.style.marginTop = '50px'
  fragment.innerText = text
  rafEle.append(fragment)
})
rafArea.append(rafEle)

const rafNodes = document.getElementsByClassName('wave-node-raf')

// 字符跳跃动画函数
const wave = (cur, start, node) => {
  if (!start) {
    start = cur
  }

  const speed = 4, timeScope = 10, distance = 2
  const elapsed = cur - start
  // 在相同的时间范围timeScope内 speed越大 那么count就越快达到timeScope临界值
  // 即动画越快
  const count = 0.01 * elapsed * speed

  if (count < timeScope) {
    node.style.transform = `translateY(-${count * distance}px)`
    window.requestAnimationFrame(cur => wave(cur, start, node))
  } else if (count < 2 * timeScope && count >= timeScope) {
    node.style.transform = `translateY(-${2 * timeScope * distance - count * distance}px)`
    window.requestAnimationFrame(cur => wave(cur, start, node))
  }
}
const action = () => {
  new Array(rafNodes.length).fill(0).map((item, index) => {
    // 使用setTimeout实现波浪
    setTimeout(() =>
        window.requestAnimationFrame(cur => wave(cur, undefined, rafNodes.item(index)))
      , index * 50
    )
  })
}

const actionBtn = document.getElementsByClassName('rfa-action')[0]
actionBtn.addEventListener('click', action)