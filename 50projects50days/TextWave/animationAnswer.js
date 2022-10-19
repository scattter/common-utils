// 添加节点
const animationArea = document.getElementsByClassName('nodes-animation')[0]
const aniContent = 'this is animation area page'
let aniEle = document.createDocumentFragment()
aniContent.split('').map((text, index) => {
  let fragment = document.createElement('span')
  fragment.className = 'wave-node-animation'
  if (text === ' ') {
    fragment.style.width = '4px'
  }
  fragment.style.animation = `wave 0.5s linear ${index * 50}ms 1 alternate`
  fragment.innerText = text
  aniEle.append(fragment)
})
animationArea.append(aniEle)